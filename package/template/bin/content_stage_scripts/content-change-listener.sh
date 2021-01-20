#!/bin/bash
#
# Script to notify the app each time any content changes.
#
source /etc/sysconfig/plugin_info
source $PLUGIN_CFG_DIR/marketplace.cfg
source $MARKETPLACE_DIR/bin/marketplace_base
source $PLUGIN_CFG_DIR/lmsAgentPlugin.cfg

while getopts "O:P:V:S:d:" opts; do
    case $opts in
        O)
            operation=$OPTARG
            ;;
        P)
            compPartNumber=$OPTARG
            ;;
        V)
            compVersion=$OPTARG
            ;;
        S)
            setId=$OPTARG
            ;;
        F)
            contentRoot=$OPTARG
            ;;
    esac;
done
shift $(($OPTIND - 1))

# RECEIVES PARAMS: "${operation}" "${setId}" "${compPartNumber}" "${compVersion}" "${contentRoot}"

if [ -z "${contentRoot}" ]; then
  # Much more reliable to get the contentRoot from LMS_DATA_QUERY than the editDispatch params
  # contentRoot cannot be looked up for 'remove' operations via LMS_DATA_QUERY.  You'll get an empty directory
  contentRoot=`$LMS_DATA_QUERY -S ${setId} -p ${compPartNumber} -a installPath -V | head -n 1`
fi

log "Starting ContentChange update: '${operation}' '${setId}' '${compPartNumber}' '${compVersion}' '${contentRoot}'"

contentChange() {
  if [ "$setId" == "MARKETPLACE_STORE_CONFIG" ] && [ -f ${contentRoot}/marketplace_store_config.json ]; then
    log "New Marketplace store configuration loaded"
    if [ -d "${MARKETPLACE_STAGE_DIR}" ] && [ -n "MARKETPLACE_STAGE_DIR" ]; then
      mv ${contentRoot}/marketplace_store_config.json $MARKETPLACE_STAGE_DIR
      log "Marketplace store configuration staged"

      STAGE_CKSUM=$(cksum ${MARKETPLACE_STAGE_DIR}/marketplace_store_config.json  | awk '{print $1$2}')
      PROD_CKSUM=$(cksum ${MARKETPLACE_STORE_CONFIG_FILE} | awk '{print $1$2}')
      if [ "${STAGE_CKSUM}" == "${PROD_CKSUM}" ]; then
        rm ${MARKETPLACE_STAGE_DIR}/marketplace_store_config.json
        log "Marketplace store config duplicated, removing stage version"
      fi
    fi

  fi

  if [ "$setId" == "MARKETPLACE_SYSTEM_CONFIG" ] && [ -f ${contentRoot}/marketplace_system_config.cfg ]; then
    log "Startup param overrides have changed, restarting service 'marketplace_service'"
    cp ${contentRoot}/marketplace_system_config.cfg $MARKETPLACE_CONFIG_OVERRIDE_FILE
    shopping_pid=`cat $MARKETPLACE_PID_FILE`
    if [ -n "${shopping_pid}" ]; then
      kill -QUIT `cat $MARKETPLACE_PID_FILE`
    fi
  fi
}

if [ $operation == "remove" ]; then
  log "Removed content, nothing to do"
fi

# Notify app of content changes
contentChange
exitStatus=$?

log "Completed ContentChange update: '${operation}' '${setId}' '${compPartNumber}' '${compVersion}' '${contentRoot}'"

exit $exitStatus
