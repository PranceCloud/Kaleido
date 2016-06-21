<<<<<<< HEAD
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
=======
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

(defn show-id [request]
  (log/info (:params request))
  (response-json {:message "show model!" :name (get-in request [:params :name]) :project (get-in request [:params :_id])}))

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
    (GET "/" request (str "models"))
    (GET "/show/:name" request (show-id request))
    (POST "/create" request (create request))
    (POST "/destory/:model" [_id model] (str "project " " model destory + " model))
    (POST "/update/:model" [_id model] (str "project " "model update + " model))))
>>>>>>> 12fa5dab22f60feb5ea0a9495816cfe6c11acf0d
