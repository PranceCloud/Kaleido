(ns hong2-lein.componse.model
  (:require [hong2-lein.tools :refer :all]
            ;[monger.core :as mg]
            [monger.collection :as mc]
            [monger.operators :refer :all]
            [compojure.core :refer :all]
            [hong2-lein.source.mongodb :as db-source]
            [clojure.tools.logging :as log]
            [ring.util.response :refer [response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  (:import [org.bson.types ObjectId]))

(declare app-inner-model-routes show-id create)

(defn show-id [name]
  ;(log/info request)
  (response-json {:message "show model!" :name name}))

(defn create [request]
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

(defn app-inner-model-routes []
  (routes
    (GET "/show/:name" [name] (show-id name))
    (POST "/create" request (create request))
    (POST "/destory/:model" [model] (str "model destory + " model))
    (POST "/update/:model" [model] (str "model update + " model))))
