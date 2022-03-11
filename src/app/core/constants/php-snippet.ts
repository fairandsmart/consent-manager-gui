/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 *
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 *
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
import { environment } from '../../../environments/environment';
import { ConsentContext } from '@fairandsmart/consents-ce/consents';
export const PHP_SNIPPET =
`<?php
function getConfig()
{
    $config["api_url"] = "$$PRIVATE_API_URL$$";
    $config["iframe_host_url"] = "$$API_URL$$";
    $config["api_key"] = "PUT YOUR API KEY HERE";

    // HTTP server env var override (useful for docker tests)
    $config["api_url"] = key_exists("API_URL", $_ENV) ? $_ENV["API_URL"] : $config["api_url"];
    $config["iframe_host_url"] = key_exists("IFRAME_HOST_URL", $_ENV) ? $_ENV["IFRAME_HOST_URL"] : $config["iframe_host_url"];
    $config["api_key"] = key_exists("API_KEY", $_ENV) ? $_ENV["API_KEY"] : $config["api_key"];
    return $config;
}

function getFormUrl()
{
    $context = [
        "subject" => "$$SUBJECT$$",
        "callback" => "$$CALLBACK$$",
        "iframeOrigin" => "$$IFRAME_ORIGIN$$",
        "language" => "$$LANGUAGE$$",
        "origin" => "$$ORIGIN$$",
        "validity" => "$$VALIDITY$$",
        "updatable" => $$UPDATABLE$$,
        "author" => "$$AUTHOR$$",
        "confirmation" => "$$CONFIRMATION$$",
        "attachFormReceipt" => $$ATTACH_FORM_RECEIPT$$,
        "layoutData" => [
          "type" => "layout",
          "info" => "$$LAYOUT_INFO$$",
          "elements" => array($$LAYOUT_ELEMENTS$$),
          "theme" => "$$LAYOUT_THEME$$",
          "notification" => "$$LAYOUT_NOTIFICATION$$",
          "orientation" => "$$ORIENTATION$$",
          "existingElementsVisible" => $$EXISTING_VISIBLE$$,
          "validityVisible" => $$VALIDITY_VISIBLE$$,
          "includeIFrameResizer" => $$IFRAME_RESIZER$$,
          "acceptAllVisible" => $$ACCEPT_ALL_VISIBLE$$,
          "acceptAllText" => "$$ACCEPT_ALL_TEXT$$",
          "submitText" => "$$SUBMIT_TEXT$$",
          "cancelVisible" => $$CANCEL_VISIBLE$$,
          "cancelText" => "$$CANCEL_TEXT$$",
          "footerOnTop" => $$STICKY_FOOTER$$,
        ]
    ];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => getConfig()["api_url"] . "/consents/token",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($context),
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . getConfig()["api_key"],
            "Content-Type: application/json",
        ),
    ));

    $consent_token = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
    }

    return getConfig()["iframe_host_url"] . "/consents?t=" . $consent_token;
}

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Right Consents iFrame Integration Test</title>
</head>
<body>
<h2 style="text-align: center">Right Consents iFrame Integration Test</h2>
<div style="text-align: center;">
    <iframe src="<?php echo getFormUrl() ?>" id="content" frameborder="0" style="width:100%; height:100vh;"></iframe>
</div>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.2.11/iframeResizer.js" onload="iFrameResize({log: true}, '#content');"></script>
</body>
</html>`;

export function getPhpSnippetFromContext(context: ConsentContext): string {
  return PHP_SNIPPET
    .replace('$$API_URL$$', environment.managerUrl)
    .replace('$$PRIVATE_API_URL$$', environment.managerPrivateUrl)
    .replace('$$SUBJECT$$', context.subject)
    .replace('$$CALLBACK$$', context.callback)
    .replace('$$IFRAME_ORIGIN$$', context.iframeOrigin)
    .replace('$$LANGUAGE$$', context.language)
    .replace('$$ORIGIN$$', context.origin)
    .replace('$$VALIDITY$$', context.validity)
    .replace('$$UPDATABLE$$', String(context.updatable))
    // .replace('$$USER_INFOS$$', context.userinfos) // TODO
    // .replace('$$ATTRIBUTES$$', context.attributes) // TODO
    .replace('$$AUTHOR$$', context.author)
    .replace('$$CONFIRMATION$$', context.confirmation)
    .replace('$$ATTACH_FORM_RECEIPT$$', String(context.attachFormReceipt))
    .replace('$$LAYOUT_INFO$$', context.layoutData.info)
    .replace('$$LAYOUT_ELEMENTS$$', `"${context.layoutData.elements.join('","')}"`)
    .replace('$$LAYOUT_THEME$$', context.layoutData.theme)
    .replace('$$LAYOUT_NOTIFICATION$$', context.layoutData.notification)
    .replace('$$ORIENTATION$$', context.layoutData.orientation)
    .replace('$$EXISTING_VISIBLE$$', String(context.layoutData.existingElementsVisible))
    .replace('$$VALIDITY_VISIBLE$$', String(context.layoutData.validityVisible))
    .replace('$$IFRAME_RESIZER$$', String(context.layoutData.includeIFrameResizer))
    .replace('$$ACCEPT_ALL_VISIBLE$$', String(context.layoutData.acceptAllVisible))
    .replace('$$ACCEPT_ALL_TEXT$$', context.layoutData.acceptAllText)
    .replace('$$SUBMIT_TEXT$$', context.layoutData.submitText)
    .replace('$$CANCEL_VISIBLE$$', String(context.layoutData.cancelVisible))
    .replace('$$CANCEL_TEXT$$', context.layoutData.cancelText)
    .replace('$$STICKY_FOOTER$$', String(context.layoutData.footerOnTop))
    ;
}
