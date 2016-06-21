(ns kaleido.componse.model
  (:require [kaleido.tools :refer :all]
    ;[monger.core :as mg]
            [monger.collection :as mc]
            [monger.operators :refer :all]
            [compojure.core :refer :all]
            [kaleido.source.mongodb :as db-source]
            [kaleido.suppose.model :as suppose-model]
            [clojure.tools.logging :as log]
            [ring.util.response :refer [response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  (:import [org.bson.types ObjectId]))

(declare app-inner-model-routes show-id create)

(defn show [request]
  (log/info request)
  (let [project-name (get-in request [:route-params :_id])
        model-name (get-in request [:route-params :name])]
    (response-json {:message "show model!" :name model-name :project project-name :params (:params request)})
    ))

(defn search [request]
  (log/info request)
  (let [project-name (get-in request [:route-params :_id])
        model-name (get-in request [:route-params :name])]
    (response-json {:message "search model!" :name model-name :project project-name})
    ))

(defn create [request]
  (log/info request)
  (let [project-name (get-in request [:route-params :_id])
        model-name (get-in request [:route-params :name])
        req (suppose-model/save project-name model-name (:body request))]
    (response-json {:message "search model!" :value req})
    ))

(defn update1
  [project-name model require]
  (log/info require)
  (response-json {:status false :message "action not found"})
  )

(defn app-inner-model-routes []
  (routes
    (GET "/" request (str "models"))
    (GET "/show/:name" request (show request))
    (ANY "/search/:name" request (show request))
    (POST "/create/:name" request (create request))
    (POST "/destory/:model" [_id model] (str "project " " model destory + " model))
    (POST "/update/:model" [_id model require] (update1 _id model require))))