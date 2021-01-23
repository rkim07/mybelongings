#!/bin/bash
#
# Example script to handle portal content change events from dispatcher
#
source /etc/sysconfig/plugin_info
source $PLUGIN_CFG_DIR/marketplace.cfg
source $MARKETPLACE_DIR/bin/marketplace_base

usage()
{
    echo "Usage:  $1 [options] "

    echo "   Handle a dispatcher PORTAL_CONTENT_CHANGED event."
    echo
    echo "   Execution Status:"
    echo "             0  if successful"
    echo "             1  if error"
    echo ""
    echo " Standard Options:"
    echo
    echo " -O {operation}             Operation:  install|remove"
    echo " -S {Set Id}                Set ID (e.g. content name)"
    echo " -F {root directory}        Root directory of content installation"
    echo " -P {component part number} Component Part Number"
    echo " -V {component part number} Component Version"
    echo " -l {logfile}               Logfile to output to"
    echo " -h                         This message"
    echo ""
    echo " Self registration Option: "
    echo " -r                         Register this script with dispatcher"
    echo ""
    echo " Test jig script options: "
    echo " -o {expected output}  Expected output"
    echo " -f {sim output file}  file containing simulated script output"
    echo " -s {return status}    Return status for script (0 if not specified)"
    exit 3
}

selfRegister()
{
    fullScriptPath=$(cd `dirname $1`; pwd)/$(basename $1)

    # source dbcore if it is available for dispatch definition
    if [ -f $PLUGIN_CFG_DIR/dbcore ]; then
        .  $PLUGIN_CFG_DIR/dbcore
    fi

    if [ -n "$EDIT_DISPATCH" ]; then
        $EDIT_DISPATCH CONFIG_FILE_CONTENT_CHANGE-MARKETPLACE_STORE_CONFIG $fullScriptPath
    else
        log "EDIT_DISPATCH not defined"
        return 1
    fi
}

while getopts "O:P:F:V:hS:d:o:l:r" opts; do
    case $opts in
        F)
            contentRoot=$OPTARG
            ;;
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
        l)
            logfile=$OPTARG
            ;;
        o)
            echo $OPTARG # echo whatever was passed in
            ;;
        f)
            cat $OPTARG # output the file
            ;;
        s)
            exitStatus=$OPTARG
            ;;
        r)
            registerOp=1
            ;;
        h)
            usage $0
            ;;
        *)
            usage $0
    esac;
done
shift $(($OPTIND - 1))

if [ -n "$registerOp" ]; then
    log "Registering this script with LMS Dispatcher..."

    selfRegister $0
    exitStatus=$?
elif [ -n "$operation" ]; then
    log "Operation (${operation}) at (${contentRoot}) for (${compPartNumber}) Version (${compVersion})"

    # Ensure that contentRoot is a directory and not the first file
    if [ -f "${contentRoot}" ]; then
      contentRoot=$(dirname ${contentRoot})
    fi
    
    $MARKETPLACE_DIR/bin/content_stage_scripts/content-change-listener.sh -O "${operation}" -S "${setId}" -P "${compPartNumber}" -V "${compVersion}" -F "${contentRoot}"
    exitStatus=$?
else
    log "Nothing to do"
    usage
    exitStatus=1
fi

log "Completed"

exit $exitStatus
