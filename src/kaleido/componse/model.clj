(ns kaleido.componse.model
  (:require [kaleido.tools :refer :all]
    ;[monger.core :as mg]
            [coercer.core :refer :all]
            [clojure.string :as string]
            [monger.collection :as mc]
            [monger.operators :refer :all]
            [compojure.core :refer :all]
            [kaleido.source.mongodb :as db-source]
            [kaleido.suppose.model :as suppose-model]
            [kaleido.suppose.project :as suppose-project]
            [clojure.tools.logging :as log]
            [ring.util.response :refer [response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  (:import [org.bson.types ObjectId]
           (java.io ObjectInput)))

(declare app-inner-model-routes show-id create destroy)

(defn show [request]
  (log/info request)
  (log/info (class (get-in request [:query-params "page-num"])))
  (let [project-name (get-in request [:route-params :_id])
        model-name (get-in request [:route-params :name])
        stat-primary-value (get-in request [:params :*])]
    (if (<= (count stat-primary-value) 1)
      ;get all by page and order
      (let [order-by-param (string/split (get-in request [:query-params "order"] "_id,1") #",")
            order-by-t (coerce (str (second order-by-param)) Integer)
            order-by {(keyword (first order-by-param)) (if (number? order-by-t) (if (> 0 order-by-t) 1 -1) -1)}
            page (coerce (get-in request [:query-params "page"] 1) Integer)
            pre-page (coerce (get-in request [:query-params "page-num"] 10) Integer)
            ; find-all igonre primary value
            records (suppose-model/get-by-condition project-name model-name {} order-by page pre-page)]
        (response-json {:message "show model!" :model model-name :project project-name :value records}))
      ;get one by primary id
      (let [model-primary-find-value (subs stat-primary-value 1)
            record (suppose-model/get-by-primary project-name model-name model-primary-find-value)]
        (log/info (str "model-primary-find-value => " model-primary-find-value))
        (response-json {:message "show model!" :model model-name :project project-name :value record}))
      )
    ))

;{"condition":
; {
;  '$or': [
;          {"bbbb": 2},
;          {"aaaaa": 2}
;          ]
;  }
; }

;$collection->find(array('name'=> array('$regex' => 'm'));
;{"condition":{"bbbb":"dsf"},"page":1,"page-num":10,"order":"name,1"}
; todo
;{"condition":{"and":[{"or":[{"A":"A"}{"b":"b"}{"c":{'$regex':'m'}}]}{"cccc":"B"}]},"page":1,"page-num":10,"order":"name,1"}
(defn search [request]
  (log/info request)
  (let [project-name (get-in request [:route-params :_id])
        model-name (get-in request [:route-params :name])
        order-by-param (string/split (get-in request [:body :order] "_id,1") #",")
        order-by-t (coerce (get order-by-param 1 1) Integer)
        order-by {(keyword (first order-by-param)) (if (number? order-by-t) (if (> 0 order-by-t) 1 -1) -1)}
        page (coerce (get-in request [:body :page] 1) Integer)
        pre-page (coerce (get-in request [:body :page-num] 10) Integer)
        find-condition (get-in request [:body :condition] {})
        ; find-all igonre primary value
        records (suppose-model/get-by-condition project-name model-name find-condition order-by page pre-page)]
    (log/info order-by-t (class order-by-t))
    (log/info find-condition order-by page)
    (response-json {:message "search model!" :model model-name :project project-name :value records})
    ))

(defn create [request]
  (log/info request)
  (let [project-name (get-in request [:route-params :_id])
        model-name (get-in request [:route-params :name])
        req (suppose-model/save project-name model-name (:body request))]
    (response-json {:message (:message req "save model") :status (:status req) :value (:value req)})
    ))

(defn destroy [request]
  (log/info request)
  (let [project-name (get-in request [:route-params :_id])
        model-name (get-in request [:route-params :name])
        stat-primary-value (get-in request [:params :*])]
    (if (<= (count stat-primary-value) 1)
      (let [allow-empty-condition (get-in request [:body :allow_empty_condition] false)
            find-condition (get-in request [:body :condition] (if allow-empty-condition {} {:_id (ObjectId.)}))
            req (suppose-model/destroy-by-condition project-name model-name find-condition)]
        (log/info (str "destory-by-condition => " find-condition))
        (response-json {:message (:message req "destroy model") :status (:status req) :value (:value req)}))
      (let [model-primary-find-value (subs stat-primary-value 1)
            req (suppose-model/destory-by-primary project-name model-name model-primary-find-value)]
        (log/info (str "destory-by-primary model-primary-find-value => " model-primary-find-value))
        (response-json {:message (:message req "destroy model") :status (:status req) :value (:value req)}))
      )
    )
  )

(defn update
  [request]
  (log/info request)
  (let [project-name (get-in request [:route-params :_id])
        model-name (get-in request [:route-params :name])
        primary-id (get-in request [:body :_id] nil)
        update-values (dissoc (get request :body) :_id)]
    (log/info ":ID => " (str primary-id (empty? primary-id)))
    ;(response-json {:status false :message update-values})
    (if (empty? primary-id)
      (response-json {:status false :message update-values})
      (let [req (suppose-model/update-by-primary-id project-name model-name primary-id update-values)]
        (response-json {:message (:message req "update model") :status (:status req) :value (:value req)}))
      )
    )
  )

(defn app-inner-model-routes []
  (routes
    (GET "/" request (str "models"))
    (GET "/show/:name*" request (show request))
    (POST "/search/:name" request (search request))
    (POST "/create/:name" request (create request))
    (POST "/destroy/:name*" request (destroy request))
    (POST "/update/:name" request (update request))))
