(ns kaleido.componse.model
  (:require [kaleido.tools :refer :all]
    ;[monger.core :as mg]
            [monger.collection :as mc]
            [monger.operators :refer :all]
            [compojure.core :refer :all]
            [kaleido.source.mongodb :as db-source]
            [clojure.tools.logging :as log]
            [ring.util.response :refer [response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  (:import [org.bson.types ObjectId]))

(declare app-inner-model-routes show-id create)

(defn show-id [_id request]
  (log/info (:params request))
  (response-json {:message "show model!" :name (get-in request [:params :name]) :project _id}))

(defn create [_id request]
  (log/info request)
  (let [db (db-source/db "test")
        coll "documents"
        oid (ObjectId.)]
    (mc/insert db coll {:_id oid :first_name "Joh时间段n" :last_name "Lennon"})
    (mc/find-map-by-id db coll oid)
    (response (str "project Create!!!"))
    ;{:status  200
    ; :headers {"Content-Type" "text/html"}
    ; :body    (str "project Create!")}
    ))

(defn app-inner-model-routes [_id]
  (routes
    (GET "/show/:name" request (show-id _id request))
    (POST "/create" request (create _id request))
    (POST "/destory/:model" [_id model] (str "project " _id " model destory + " model))
    (POST "/update/:model" [_id model] (str "project " _id "model update + " model))))
