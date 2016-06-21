<<<<<<< HEAD
(ns kaleido.suppose.session
  (:require [clojure.tools.logging :as log]
            [monger.collection :as mc]
            [clj-time.core :as t]
            [clj-time.coerce :as tc]
            [ring.middleware.session.store :as ringstore])
  (:import java.util.UUID))

(deftype MongodbStore [db collection-name expire-secs reset-on-read]
  ringstore/SessionStore
  (read-session [_ key]
    (log/info "SESSION  read-session => " key)
    (let [entity (mc/find-one db collection-name {:key (str key)})
          exprie-time (+ (:time entity (tc/to-long (t/now))) (* expire-secs 1000))]
      (log/warn "SESSION RECORD : " entity)
      (if (or (empty? entity) (> exprie-time (tc/to-long (t/now))))
        {}
        entity)))
  (write-session [_ key data]
    (log/info "SESSION write-session (find session-key) => " key)
    (log/info "SESSION write-session (data) => " data)
    (let [entity (mc/find-one db collection-name {:key (str key)})]
      (log/info "SESSION FIND => " {:key (str key)} entity)
      (let [doc-key (:key entity (str (UUID/randomUUID)))
            new-exprie-time (+ (tc/to-long (t/now)) (* expire-secs 1000))
            new-session-document (merge data {:key doc-key :time new-exprie-time})]
        (log/info "SESSION write-session => " new-session-document)
        (mc/save db collection-name new-session-document)
        (log/info "SESSION write-session (retrun key) => " doc-key)
        doc-key)
      )
    )
  (delete-session [_ key]
    (log/info "SESSION delete-session => " key)
    (mc/remove db collection-name {:key (str key)})
    nil))

(defn mongodb-store
  ([db-conn collection-name {:keys [expire-secs reset-on-read]
                             :or   {expire-secs   144000
                                    reset-on-read true}}]
   (log/info "MONGODB_STORE " expire-secs)
=======
(ns kaleido.suppose.session
  (:require [clojure.tools.logging :as log]
            [monger.collection :as mc]
            [clj-time.core :as t]
            [clj-time.coerce :as tc]
            [ring.middleware.session.store :as ringstore])
  (:import java.util.UUID))

(deftype MongodbStore [db collection-name expire-secs reset-on-read]
  ringstore/SessionStore
  (read-session [_ key]
    (log/info "SESSION  read-session => " key)
    (let [entity (mc/find-one db collection-name {:key (str key)})
          exprie-time (+ (:time entity (tc/to-long (t/now))) (* expire-secs 1000))]
      (log/warn "SESSION RECORD : " entity)
      (if (or (empty? entity) (> exprie-time (tc/to-long (t/now))))
        {}
        entity)))
  (write-session [_ key data]
    (log/info "SESSION write-session (find session-key) => " key)
    (log/info "SESSION write-session (data) => " data)
    (let [entity (mc/find-one db collection-name {:key (str key)})]
      (log/info "SESSION FIND => " {:key (str key)} entity)
      (let [doc-key (:key entity (str (UUID/randomUUID)))
            new-exprie-time (+ (tc/to-long (t/now)) (* expire-secs 1000))
            new-session-document (merge data {:key doc-key :time new-exprie-time})]
        (log/info "SESSION write-session => " new-session-document)
        (mc/save db collection-name new-session-document)
        (log/info "SESSION write-session (retrun key) => " doc-key)
        doc-key)
      )
    )
  (delete-session [_ key]
    (log/info "SESSION delete-session => " key)
    (mc/remove db collection-name {:key (str key)})
    nil))

(defn mongodb-store
  ([db-conn collection-name {:keys [expire-secs reset-on-read]
                             :or   {expire-secs   144000
                                    reset-on-read true}}]
   (log/info "MONGODB_STORE " expire-secs)
>>>>>>> 12fa5dab22f60feb5ea0a9495816cfe6c11acf0d
   (MongodbStore. db-conn collection-name expire-secs reset-on-read)))