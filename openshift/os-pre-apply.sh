#!/bin/bash
set -e

printInfo() {
  echo -e "\033[32m[INFO]: ${1}\033[0m"
}

inject_config_production () {
     printInfo "Apply configuration for production: "
    if [ -z "$SEMREL_INFO_NEXT_VERSION" ]; then
      WEBAPP_VERSION=$SEMREL_INFO_LAST_VERSION
    else
      WEBAPP_VERSION=$SEMREL_INFO_NEXT_VERSION
    fi
    oc create configmap config-${environment_name} \
      --from-literal=NUXT_PUBLIC_WEBAPP_VERSION=$WEBAPP_VERSION \
      --dry-run=client -o yaml | oc apply -f -
    printInfo "Configuration for production successfully applied"
}

inject_config_staging() {
    printInfo "Apply configuration for staging: "
     printInfo "Apply configuration for staging: "
    if [ -z "$SEMREL_INFO_NEXT_VERSION" ]; then
      WEBAPP_VERSION=$SEMREL_INFO_LAST_VERSION
    else
      WEBAPP_VERSION=$SEMREL_INFO_NEXT_VERSION
    fi
    oc create configmap config-${environment_name} \
      --from-literal=NUXT_PUBLIC_WEBAPP_VERSION=$WEBAPP_VERSION \
      --dry-run=client -o yaml | oc apply -f -
    printInfo "Configuration for staging successfully applied"
}

inject_config_integration () {
    printInfo "Apply configuration for integration: "
    # oc create configmap config-${environment_name} \
    #   --from-literal=NUXT_BACKEND_URL=$BACKEND_URL_INTEGRATION \
    #   --dry-run=client -o yaml | oc apply -f -
    printInfo "Configuration for integration successfully applied"
}

printInfo "Start config deployment"
if [ "$stage" == "production" ]; then
    printInfo "Stage: PRODUCTION"
    inject_config_production
elif [ "$stage" == "staging" ]; then
    printInfo "Stage: STAGING"
    inject_config_staging
elif [ "$stage" == "integration" ]; then
    printInfo "Stage: INTEGRATION"
    inject_config_integration
fi

printInfo "Config deployment ended"
