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