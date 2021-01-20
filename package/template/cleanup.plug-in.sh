#!/bin/sh
source /etc/sysconfig/plugin_info
source $PLUGIN_CFG_DIR/marketplace.cfg
source $MARKETPLACE_DIR/bin/marketplace_base


# Cleanup logs
rm ${PLUGIN_LOG_DIR}/*.log
