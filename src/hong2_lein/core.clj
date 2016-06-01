(ns hong2-lein.core
  (:gen-class)
  (:use ring.adapter.jetty)
  (:require [hong2-lein.tools :refer :all]
            ;[hong2-lein.setting :as app-setting]
            ;[hong2-lein.source.mongodb :as app-source]
            [hong2-lein.suppose.session :refer [mongodb-store]]
            [compojure.core :refer :all]
            [compojure.route :as route]
            [hong2-lein.componse.project :as route-project]
            [hong2-lein.componse.model :as route-model]
            [hong2-lein.componse.auth :as route-auth]
            [ring.middleware.anti-forgery :refer :all]
            [ring.middleware.session :refer [wrap-session]]
            [clojure.tools.logging :as log]
            [cheshire.core :refer :all]
            [ring.middleware.json :refer [wrap-json-response]]
            [ring.middleware.json :refer [wrap-json-params]]
            [ring.util.response :refer [response]]
            [ring.middleware.resource :refer :all]
            ;[ring.handler.dump :as ring-handle-dump]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

;[ring.util.response :refer [content-type]]
;[hong2-lein.componse.ws :as route-char]
;[ring.middleware.logger :as logger]

(def hong2-version "0.0.1")

(defn pong [require]
  (log/info (:session require))
  (let [session (:session require)
        count (:count session 0)
        session (assoc session :count (inc count))]
    (-> (response {:message "pong" :count count})
        (assoc :session session))
    ))

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


(defroutes app-routes
           (GET "/" [] "Hong2 Project")
           (GET "/version" [] (str hong2-version))
           (POST "/remote" require (remote-command require))
           (GET "/remote" require (remote-command require))
           (GET "/ping" require (pong require))
           (GET "/csrf" [] (response-json {:csrf *anti-forgery-token*}))
           ;(context "/" []
           ;         (app-root-routes))
           (context "/project" []
             (route-project/app-inner-project-routes))
           (context "/model" []
             (route-model/app-inner-model-routes))
           (context "/auth" []
             (route-auth/app-inner-auth-routes))
           ;(context "/char" []
           ;  (route-char/websocket-routes))
           (route/not-found "Not Found"))

(def app
  ;(wrap-json-params (wrap-json-response app-routes))
  (wrap-defaults
    (-> app-routes
        (wrap-resource "resources")
        ;(wrap-session {:store (mongodb-store (app-source/db app-setting/system-db) app-setting/system-session {})})
        ;(wrap-anti-forgery)
        (wrap-json-params)
        (wrap-json-response))
    (update-in site-defaults [:security] assoc :anti-forgery true)))

(defn start []
  "Hong2"
  (log/info "start...")
  (run-jetty #'app {:port 3000}))

(defn -main [& args]
  (start))