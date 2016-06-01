(ns kaleido.componse.project
  (:require [kaleido.tools :refer :all]
    ;[monger.core :as mg]
            [monger.collection :as mc]
            [monger.operators :refer :all]
            [compojure.core :refer :all]
            [kaleido.source.mongodb :as db-source]
    ;[compojure.route :as route]
            [kaleido.componse.model :as route-model]
            [kaleido.componse.auth :as route-auth]
            [clojure.tools.logging :as log]
            [ring.util.response :refer [header response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  (:import [org.bson.types ObjectId]))

(declare app-inner-project-routes show)

(defn show [_id]
  (response-json {:name "project11" :baz 13333}))

(defn create [request]
  (log/info request)
  (let [db (db-source/db "test")
        coll "documents"
        oid (ObjectId.)]
    (mc/insert db coll {:_id oid :first_name "Joh时间段n" :last_name "Lennon"})
    (mc/find-map-by-id db coll oid)
    (response-json {:name "project Create!" :baz 1333})
    ))

(defn app-inner-project-routes []
  (routes
    (POST "/create" require (create require))
    (GET "/create" require (create require))
    (GET "/" [] (str "project ALL"))
    (GET "/show/:_id" [_id] (show _id))
    (POST "/:_id/search" [] (str "project + "))
    (DELETE "/:_id/destory" [_id] (str "project destory by " _id))
    (POST "/:_id/update" [_id] (str "project update + " _id))
    (context "/:_id/model" [_id]
      (route-model/app-inner-model-routes _id))
    (context "/:_id/auth" [_id]
      (route-auth/app-inner-auth-routes _id))))
