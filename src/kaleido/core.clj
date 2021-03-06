(ns kaleido.core
  (:gen-class)
  (:use ring.adapter.jetty)
  (:require [kaleido.tools :refer :all]
            [kaleido.setting :refer :all]
    ;[kaleido.setting :as app-setting]
    ;[kaleido.source.mongodb :as app-source]
            [kaleido.suppose.session :refer [mongodb-store]]
            [compojure.core :refer :all]
            [compojure.route :as route]
            [kaleido.componse.admin :as route-admin]
            [kaleido.componse.project :as route-project]
            [kaleido.componse.debug :as route-debug]
    ;[kaleido.componse.auth :as route-auth]
            [ring.middleware.anti-forgery :refer :all]
            [ring.middleware.session :refer [wrap-session]]
            [clojure.tools.logging :as log]
            [cheshire.core :refer :all]
            [ring.middleware.json :refer [wrap-json-response]]
            [ring.middleware.json :refer [wrap-json-body]]
            [ring.util.response :refer [response]]
            [ring.middleware.resource :refer :all]
    ;[ring.handler.dump :as ring-handle-dump]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

;[ring.util.response :refer [content-type]]
;[kaleido.componse.ws :as route-char]
;[ring.middleware.logger :as logger]


(defn pong [require]
  (let [session (:session require)
        count (:count session 0)
        session (assoc session :count (inc (if (>= count 10) 0 count)))]
    (-> (response {:message "pong" :version -version :count count})
        (assoc :session session))))

(defn remote-command [require]
  ;(log/info require)
  ;(log/info (str "compojure/path => " (:compojure/route require)))
  ;(log/info (str "require-url => " (ring-handle-dump/handle-dump require)))
  ;(log/info (route-project/show "ss" require))
  ;(log/info ((routes #'app require)))

  {:status  200
   :headers {"Access-Control-Allow-Origin" "*" "Content-Type" "application/json"}
   :body    {:foo "bar" :baz 5}}
  ;(str "HEELLO")
  )

(defn get-session [require]
  (let [session (:session require)]
    (log/info (str "session => " session))
    ;(log/info {:message (str auth_status) :value auth_account})
    (response-json session)))

(defn app-routes
  []
  (routes
    (GET "/" [] "Kaleido Project")
    (GET "/ping" require (pong require))
    (POST "/remote" require (remote-command require))
    (GET "/csrf" [] (response-json {:csrf *anti-forgery-token*}))
    (GET "/me" require (get-session require))
    (context debug-url []
      (route-debug/app-inner-debug-routes))
    (context manager-url []
      (route-admin/app-inner-admin-routes))
    (context project-prefix-url []
      (route-project/app-inner-project-routes))
    ;(context "/char" []
    ;  (route-char/websocket-routes))
    (route/not-found "Not Found"))
  )

(def app
  ;(wrap-json-params (wrap-json-response app-routes))
  (wrap-defaults
    (-> (app-routes)
        (wrap-resource "resources")
        ;(wrap-session {:store (mongodb-store (app-source/db app-setting/system-db) app-setting/system-session {})})
        ;(wrap-anti-forgery)
        (wrap-json-body {:keywords? true :bigdecimals? true})
        (wrap-json-response {:pretty true}))
    (update-in site-defaults [:security] assoc :anti-forgery true)))

(defn start []
  "Hong2"
  (log/info "start...")
  (run-jetty #'app {:port 3000}))

(defn -main [& args]
  (start))