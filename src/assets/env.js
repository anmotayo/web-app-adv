(function(window) {
  window["env"] = window["env"] || {};

  // BackEnd Environment variables
  window["env"]["fineractApiUrls"] = 'https://localhost:8443,https://dev.mifos.io,http://localhost:8080';
  window["env"]["fineractApiUrl"]  = 'http://localhost:8080';

  window["env"]["apiProvider"] = '';
  window["env"]["apiVersion"]  = '';
  window["env"]["apiActuator"]  = '';

  window["env"]["fineractPlatformTenantId"]  = 'default';
  window["env"]["fineractPlatformTenantIds"]  = 'default,advanclymfb';

  window['env']['tenantLogoUrl'] = '';

  // Language Environment variables
  window["env"]["defaultLanguage"] = 'en-US';
  window["env"]["supportedLanguages"] = 'cs-CS,de-DE,en-US,es-MX,fr-FR,it-IT,ko-KO,lt-LT,lv-LV,ne-NE,pt-PT,sw-SW';

  window['env']['preloadClients'] = '';

  // Char delimiter to Export CSV options: ',' ';' '|' ' '
  window['env']['defaultCharDelimiter'] = ',';

  // Display or not the Server Selector
  window['env']['allowServerSwitch'] = '';
  
  // Display or not the BackEnd Info
  window['env']['displayBackEndInfo'] = '';

  // Display or not the Tenant Selector
  window['env']['displayTenantSelector'] = '';

  // Time in seconds for Notifications, default 60 seconds
  window['env']['waitTimeForNotifications'] = '';

  // Time in seconds for COB Catch-Up, default 30 seconds
  window['env']['waitTimeForCOBCatchUp'] = '';

  // Time in milliseconds for Session idle timeout, default 300000 seconds
  window['env']['sessionIdleTimeout'] = '0';

  // OAuth Server Enabled
  window['env']['oauthServerEnabled'] = false;

  // OAuth Server URL
  window['env']['oauthServerUrl'] = '';

  // OAuth Client Id
  window['env']['oauthAppId'] = '';

  // OIDC Plugin Environment variables
  window['env']['oidcServerEnabled'] = false;
  window['env']['oidcBaseUrl']       = '';
  window['env']['oidcClientId']      = '';
  window['env']['oidcApiUrl']        = '';
  window['env']['oidcFrontUrl']      = '';

})(this);
