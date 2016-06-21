(ns kaleido.suppose.uploads
  (:use digest monger.json)
  (:require [kaleido.setting :as app-setting]
            [compojure.core :refer :all]
            [kaleido.tools :refer :all]
            [clojure.tools.logging :as log]
            [kaleido.source.mongodb :as db-source]
            [monger.collection :as mc]
            [kaleido.suppose.project :as project-componse]
            [monger.conversion :refer [to-db-object from-db-object]]
            [clj-time.local :as l]
            [monger.gridfs :refer [store-file make-input-file filename content-type metadata]]
            [monger.core :as mg]
            monger.json
            monger.joda-time)
  (:import [org.bson.types ObjectId]
           ))

(declare save-file-to-grids upload-file-save)

(defn upload-file-save
  "project-name string
  model string -> tables
  values array -> table values"
  [project-name session model field multipart]
  (let [project (project-componse/get-by-name project-name)]
    (if (empty? project)
      {:status false :message (str project-name " project not found")}
      (let [db (db-source/db project-name)
            coll app-setting/project-upload-collection
            oid (ObjectId.)
            n (to-db-object (l/local-now))
            ownid (get-in session [:account project-name :auth :login_name] nil)]
        (log/info model field multipart)
        (log/info {:_id oid :ownid ownid :model model :filename (:filename multipart) :updated n})
        (mc/insert db coll {:_id oid :ownid ownid :model model :field field :filename (:filename multipart) :updated n})
        (save-file-to-grids project-name (str oid) multipart)
        {:status true :value (mc/find-map-by-id db coll oid)})))
  )

(defn save-file-to-grids
  [project-name id file]
  (let [fs (mg/get-gridfs db-source/source-conn project-name)]
    (store-file (make-input-file fs (:tempfile file))
                (filename (str id))
                (metadata {:filename (:filename file) :size (:size file)})
                (content-type (:content-type file)))))