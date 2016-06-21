<<<<<<< HEAD
(ns kaleido.suppose.project
  (:use digest monger.json)
  (:require [kaleido.setting :as app-setting]
            [compojure.core :refer :all]
            [kaleido.tools :refer :all]
            [clojure.tools.logging :as log]
            [kaleido.source.mongodb :as db-source]
            [monger.collection :as mc]
            [monger.conversion :refer [from-db-object]]))


(declare get-by-name save-model)

(defn get-by-name
  [name]
  (let [db (db-source/db app-setting/system-db)
        coll app-setting/system-project
        mg-object (mc/find-one db coll {:name name})
        rd (from-db-object mg-object true)]
    rd))

(defn get-all-name
  []
  (let [db (db-source/db app-setting/system-db)
        coll app-setting/system-project
        mg-object (mc/find-maps db coll {} ["name"])
        rds (from-db-object mg-object true)]
    (log/info mg-object)
    (log/info rds)
    rds))

(defn save
  [project-name values]
  (let [project (get-by-name project-name)]
    (if (empty? project)
      {:status false :message (str project-name " project not found")}
      (let [db (db-source/db app-setting/system-db)
            coll app-setting/system-project
            filter-values (into {} (filter (fn [[k _]] (contains? (hash-set :name :path :allowIP) k)) values))]
        (mc/update-by-id db coll (:_id project) (merge project filter-values))
        {:status true :value values}))))

(defn save-model
  "project-name string
  model string -> tables
  values array -> table values"
  [project-name model values]
  (let [project (get-by-name project-name)]
    (if (empty? project)
      {:status false :message (str project-name " project not found")}
      (let [db (db-source/db app-setting/system-db)
            coll app-setting/system-project
            filter-fields (fliter-key-in-array #{:name :fields :type :join :attrs} (:fields values))
            data (into [(merge values {:fields filter-fields})]
                       (filter #(not (= (:name %) model)) (get-in project [:model :data])))]
        (log/info values)
        (log/info filter-fields)
        (mc/update-by-id db coll (:_id project) (merge project {:model {:data data}}))
        {:status true :value data})))
  )

(defn delete-model
  [project-name model]
  (let [project (get-by-name project-name)]
    (if (empty? project)
      {:status false :message (str model " project not found")}
      (let [db (db-source/db app-setting/system-db)
            coll app-setting/system-project
            data (into [] (filter #(not (= (:name %) model)) (get-in project [:model :data])))]
        (log/info data)
        (mc/update-by-id db coll (:_id project) (merge project {:model {:data data}}))
        {:status true :value data})))
  )
=======
(ns kaleido.suppose.project
  (:use digest monger.json)
  (:require [kaleido.setting :as app-setting]
            [compojure.core :refer :all]
            [kaleido.tools :refer :all]
            [clojure.tools.logging :as log]
            [kaleido.source.mongodb :as db-source]
            [monger.collection :as mc]
            [monger.conversion :refer [from-db-object]]))


(declare auth gen-password get-by-name create change)

(defn get-by-name
  [name]
  (let [db (db-source/db app-setting/system-db)
        coll app-setting/system-project
        mg-object (mc/find-one db coll {:name name})
        rd (from-db-object mg-object true)]
    rd))

(defn get-all-name
  []
  (let [db (db-source/db app-setting/system-db)
        coll app-setting/system-project
        mg-object (mc/find-maps db coll {} ["name"])
        rds (from-db-object mg-object true)]
    (log/info mg-object)
    (log/info rds)
    rds))
>>>>>>> 12fa5dab22f60feb5ea0a9495816cfe6c11acf0d
