(ns kaleido.suppose.model
  (:use digest monger.json)
  (:require [kaleido.setting :as app-setting]
            [compojure.core :refer :all]
            [kaleido.tools :refer :all]
            [clojure.tools.logging :as log]
            [kaleido.source.mongodb :as db-source]
            [kaleido.suppose.project :as project-suppose]
            [monger.collection :as mc]
            [monger.conversion :refer [from-db-object]]
            [monger.query :as mq])
  (:import [org.bson.types ObjectId]
           ))

(declare get-all get-by-primary fliter-field-value)

(defn get-by-primary
  [project-name model-name primary-value]
  (let [db (db-source/db project-name)
        coll model-name
        primary-fields (project-suppose/get-model-primary-fields project-name model-name)
        p-field (if (= 0 (count primary-fields)) :_id (:name (first primary-fields) :_id))
        ]
    (log/info "find primary-fields" {p-field primary-value})
    (if (= p-field :_id)
      (try
        (let [oid-value (ObjectId. primary-value)]
          (from-db-object (mc/find-by-id db coll oid-value) true))
        (catch Exception e {:status false :message (str "caught exception: " (.getMessage e))}))
      (from-db-object (mc/find-one db coll {p-field primary-value}) true))))

(defn get-by-condition
  [project-name model condition sort-by page per-page]
  (let [db (db-source/db project-name)
        coll model
        c (if (nil? condition) {} condition)
        p (if (nil? page) 1 page)
        pp (if (nil? per-page) 10 per-page)
        sb (if (nil? sort-by) {:_id -1} sort-by)]
    (log/info project-name model condition sort-by page per-page)
    (log/info c p pp sb)
    (mq/with-collection db coll
                        (mq/find c)
                        (mq/sort sb)
                        (mq/paginate :page p :per-page pp)
                        ;(from-db-object (mc/find db coll) true)
                        ))
  )

(defn destroy-by-condition
  [project-name model condition]
  (let [db (db-source/db project-name)
        coll model
        c (if (nil? condition) {} condition)]
    (log/info project-name model condition c)
    (mc/remove db coll c)
    {:status true :value condition})
  )

(defn destory-by-primary
  [project-name model-name primary-value]
  (let [db (db-source/db project-name)
        coll model-name
        primary-fields (project-suppose/get-model-primary-fields project-name model-name)
        p-field (if (= 0 (count primary-fields)) :_id (:name (first primary-fields) :_id))]
    (log/info "destory primary-fields " {p-field primary-value})
    (if (= p-field :_id)
      (try
        (let [oid-value (ObjectId. primary-value)]
          (mc/remove-by-id db coll oid-value)
          {:status true :value oid-value})
        (catch Exception e {:status false :message (str "caught exception: " (.getMessage e))})
        )
      (do (mc/remove db coll {p-field primary-value})
          {:status true :value {p-field primary-value}}))))

(defn update-by-primary-id
  [project-name model-name oid values]
  (let [project (project-suppose/get-by-name project-name)]
    (log/info "current project => " project)
    (if (empty? project)
      {:status false :message (str project-name " project not found")}
      (let [model (into {} (filter #(= model-name (:name %)) (get-in project [:model :data])))
            fields (into [] (map #(:name %) (:fields model)))
            fields-update-value (into {} (map #(fliter-field-value project model values %) fields))]
        (log/info "save model1 => " model)
        (log/info "save model2 => " (:fields model))
        (log/info "save model3 => " fields)
        (log/info "save model4 => " values)
        (log/info fields-update-value)
        (if (empty? model)
          {:status false :message (str model-name " model not found")}
          (let [db (db-source/db project-name)
                coll model-name]
            (try
              (let [oid (ObjectId. oid)]
                (log/info "update Project , Model => " project-name coll)
                (log/info "update => " (merge fields-update-value {:_id oid}))
                (mc/update-by-id db coll oid fields-update-value)
                {:status true :value (mc/find-map-by-id db coll oid)})
              (catch Exception e {:status false :message (str "caught exception: " (.getMessage e))})
              )
            ;{:status true :value 1}
            )))
      )))

(defn update-by-condition
  [project-name model-name condition values])

(defn save
  [project-name model-name values]
  (let [project (project-suppose/get-by-name project-name)]
    (log/info "current project => " project)
    (if (empty? project)
      {:status false :message (str project-name " project not found")}
      (let [model (into {} (filter #(= model-name (:name %)) (get-in project [:model :data])))
            fields (into [] (map #(:name %) (:fields model)))
            fields-update-value (into {} (map #(fliter-field-value project model values %) fields))]
        (log/info "save model1 => " model)
        (log/info "save model2 => " (:fields model))
        (log/info "save model3 => " fields)
        (log/info "save model4 => " values)
        (log/info fields-update-value)
        (if (empty? model)
          {:status false :message (str model-name " model not found")}
          (let [db (db-source/db project-name)
                coll model-name
                oid (ObjectId.)]
            (log/info "save Project , Model => " project-name coll)
            (log/info "save Insert => " (merge fields-update-value {:_id oid}))
            (mc/insert db coll (merge fields-update-value {:_id oid}))
            {:status true :value (mc/find-map-by-id db coll oid)}
            ;{:status true :value 1}
            )))
      )))

(defn- fliter-field-value
  [project model value field]
  (log/info project model value field)
  ;field (contains? field (keyword value))
  {(keyword field) (get value (keyword field) nil)})