#!/bin/bash
# description: Used to open all flight components

source /etc/sysconfig/plugin_info
source $PLUGIN_CFG_DIR/marketplace.cfg
source $MARKETPLACE_DIR/bin/marketplace_base

log "Running component open-flight scripts"

$MARKETPLACE_DIR/bin/flight_stage_scripts/open_flight_example.sh

log "Completed"

exit 1
