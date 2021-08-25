get_customer_url() {
  local IP=${1:-127.0.0.1}
  local SECRET=${2:-Supernova123!}
  local EXPIRES="$(date -d "today + 30 minutes" +%s)";
  local token="$(echo -n "${EXPIRES} ${IP} ${SECRET}" | openssl md5 -binary | openssl base64 | tr +/ -_ | tr -d =)"
  echo "http://139.59.114.247:8000/encrypted/videos/${token}/${EXPIRES}"
}

get_customer_url 125.235.238.6 "Supernova123!"
