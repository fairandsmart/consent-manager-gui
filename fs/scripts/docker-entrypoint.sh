#!/usr/bin/env sh

set -e

[ -z "$FS_DEBUG" ] || set -x

install_theme() {
    [ "$#" -ne 1 ] && error "install_theme : wrong number of args"
    theme_folder="/themes/$1"
    [ -r "$theme_folder"  ] || error "can't read theme $theme_folder"

    while IFS= read -r line
    do
        from=$(echo "$line" | sed "s/|[^|]\+//")
        to=$(echo "$line" | sed "s/[^|]\+|//")
        find "$WHEREMYFILESARE" -type f -exec sed -i "s|$from|$to|g" {} \;
    done < "$theme_folder"
}

# consts
WHEREMYFILESARE=/usr/share/nginx/html

# vars
FS_AUTH_ORIGINAL_CLIENTID=${FS_AUTH_ORIGINAL_CLIENTID:-PUT_AUTH_CLIENTID_HERE}
FS_AUTH_CLIENTID=${FS_AUTH_CLIENTID:-cmclient}
FS_AUTH_ORIGINAL_REALM=${FS_AUTH_ORIGINAL_REALM:-PUT_AUTH_REALM_HERE}
FS_AUTH_REALM=${FS_AUTH_REALM:-RightConsents}
FS_AUTH_ORIGINAL_URL=${FS_AUTH_ORIGINAL_URL:-PUT_AUTH_HOST_HERE}
FS_AUTH_URL=${FS_AUTH_URL:-http://127.0.0.1:8080}
FS_MANAGER_ORIGINAL_URL=${FS_MANAGER_ORIGINAL_URL:-PUT_MANAGER_URI_HERE}
FS_MANAGER_URL=${FS_MANAGER_URL:-http://127.0.0.1:8087}
FS_MANAGER_PRIVATE_ORIGINAL_URL=${FS_MANAGER_PRIVATE_ORIGINAL_URL:-PUT_MANAGER_PRIVATE_URI_HERE}
FS_MANAGER_PRIVATE_URL=${FS_MANAGER_PRIVATE_URL:-http://127.0.0.1:8087}
FS_THEME=${FS_THEME:-community-dev}

echo Installing "$FS_THEME" theme
install_theme "$FS_THEME"

# set AUTH clientid
echo Setting AUTH clientid FS_AUTH_CLIENTID
[ -n "$FS_AUTH_CLIENTID" ]
find "$WHEREMYFILESARE" -type f -exec sed -i "s|$FS_AUTH_ORIGINAL_CLIENTID|$FS_AUTH_CLIENTID|g" {} \;
grep -qr "$FS_AUTH_CLIENTID" "$WHEREMYFILESARE"

# set AUTH realm
echo Setting AUTH realm FS_AUTH_REALM
[ -n "$FS_AUTH_REALM" ]
find "$WHEREMYFILESARE" -type f -exec sed -i "s|$FS_AUTH_ORIGINAL_REALM|$FS_AUTH_REALM|g" {} \;
grep -qr "$FS_AUTH_REALM" "$WHEREMYFILESARE"

# set AUTH endpoint
echo Setting AUTH endpoint FS_AUTH_URL
[ -n "$FS_AUTH_URL" ]
find "$WHEREMYFILESARE" -type f -exec sed -i "s|$FS_AUTH_ORIGINAL_URL|$FS_AUTH_URL|g" {} \;
grep -qr "$FS_AUTH_URL" "$WHEREMYFILESARE"

# set MANAGER endpoint
echo Setting MANAGER endpoint FS_MANAGER_URL
[ -n "$FS_MANAGER_URL" ]
find "$WHEREMYFILESARE" -type f -exec sed -i "s|$FS_MANAGER_ORIGINAL_URL|$FS_MANAGER_URL|g" {} \;
grep -qr "$FS_MANAGER_URL" "$WHEREMYFILESARE"

# set MANAGER FRONT endpoint
echo Setting MANAGER FRONT endpoint FS_MANAGER_URL
[ -n "$FS_MANAGER_PRIVATE_URL" ]
find "$WHEREMYFILESARE" -type f -exec sed -i "s|$FS_MANAGER_PRIVATE_ORIGINAL_URL|$FS_MANAGER_PRIVATE_URL|g" {} \;
grep -qr "$FS_MANAGER_PRIVATE_URL" "$WHEREMYFILESARE"

# go
exec nginx -g "daemon off;"
