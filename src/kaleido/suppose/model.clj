(ns kaleido.suppose.model
  (:use digest monger.json)
  (:require [kaleido.setting :as app-setting]
            [compojure.core :refer :all]
            [kaleido.tools :refer :all]
            [clojure.tools.logging :as log]
            [kaleido.source.mongodb :as db-source]
            [kaleido.suppose.project :as project-suppose]
            [monger.collection :as mc]
            [monger.conversion :refer [from-db-object]])
  (:import [org.bson.types ObjectId]
           ))

(declare get-all get-by-key fliter-field-value)

(defn get-by-key
  [project-name model]
  (let [db (db-source/db app-setting/system-db)
        coll project-name
        mg-object (mc/find-one db coll {:name name})
        rd (from-db-object mg-object true)]
    rd))

(defn save
  [project-name model-name values]
  (let [project (project-suppose/get-by-name project-name)]
    (log/info "save project => " project)
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