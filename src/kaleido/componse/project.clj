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
            [kaleido.componse.event :as route-event]
            [kaleido.suppose.project :as suppose-project]
            [kaleido.suppose.uploads :as suppose-uploads]
            [clojure.tools.logging :as log]
            [ring.util.response :refer [header response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  (:import [org.bson.types ObjectId]
    ;[org.eclipse.jetty.server.HttpInputOverHTTP ]
           ))

(declare app-inner-project-routes show)

(defn show [_id]
  (response-json (suppose-project/get-by-name _id)))

(defn create [request]
  (log/info request)
  (let [db (db-source/db "test")
        coll "documents"
        oid (ObjectId.)]
    (mc/insert db coll {:_id oid :first_name "Joh时间段n" :last_name "Lennon"})
    (mc/find-map-by-id db coll oid)
    (response-json {:name "project Create!" :baz 1333})
    ))

(defn update-project [request]
  (let [params (:body request)
        project-name (get-in request [:route-params :_id])]
    (log/info params)
    (response-json (suppose-project/save project-name params))
    )
  )

(defn update-model
  [request]
  (log/info request)
  (let [params (:body request)
        key (:key params)
        project-name (get-in request [:route-params :_id])
        values (into {} (filter (fn [[k _]] (contains? (hash-set :name :fields :defined) k)) params))]
    (log/info params)
    (log/info values)
    (if (empty? (str key))
      (response-json {:status false :message "lost model key?"})
      (response-json (suppose-project/save-model project-name key values))
      )
    )
  )

(defn destroy-model
  [request]
  (log/info (get-in request [:route-params :_id]))
  (log/info request)
  (let [params (:body request)
        project-name (get-in request [:route-params :_id])
        model-name (:name params)]
    (log/info params)
    (response-json (suppose-project/delete-model project-name model-name))
    )
  )

(defn upload-file
  [request]
  (log/info request)
  (log/info (:multipart-params request))
  (let [mp (:multipart-params request)
        md (get mp "model" "")
        fd (get mp "field" "")
        upload_name (get mp "upload_name" fd)]
    (if (or (empty? md) (empty? fd))
      (response-json {:message "lost model or field" :status false})
      (let [project-name (get-in request [:route-params :_id])
            session (:session request)
            multi (get mp upload_name {})]
        (log/info "session => " session)
        (log/info project-name md fd multi)
        (if (empty? multi)
          (response-json {:message "missing field in multipart" :status false})
          (let [u (suppose-uploads/upload-file-save project-name session md fd multi)]
            (log/info "upload-file => " u)
            (if (or (:status u) (not (nil? (:value u))))
              (response-json {:value (:value u) :success 1 :status true})
              (response-json {:message (:message u) :success 0 :status false})
              )))))
    )
  )

(defn app-inner-project-routes []
  (routes
    (POST "/create" request (create request))
    (GET "/create" request (create request))
    (GET "/:_id/" [_id] (show _id))
    ;(POST "/:_id/search" [] (str "project + "))
    (DELETE "/:_id/destory" [_id] (str "project destory by " _id))
    (POST "/:_id/upload" request (upload-file request))
    (POST "/:_id/update" request (update-project request))
    (POST "/:_id/update/model" request (update-model request))
    (POST "/:_id/destroy/model" request (destroy-model request))
    (context "/:_id/model" [_id]
      (route-model/app-inner-model-routes))
    (context "/:_id/auth" [_id]
      (route-auth/app-inner-auth-routes))
    (context "/:_id/event" [_id]
      (route-event/app-inner-event-routes))
    ))
