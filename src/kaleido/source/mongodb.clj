<<<<<<< HEAD
(ns kaleido.source.mongodb
  (:require [monger.core :as mg]
            [clojure.data.json]
            [monger.joda-time]
            [monger.json])
  (:import [com.mongodb MongoOptions ServerAddress]
           [org.joda.time DateTimeZone]))

(def source-conn-host "localhost")

(def source-conn-port 27017)

(def source-conn
  (let [^MongoOptions opts (mg/mongo-options {:threads-allowed-to-block-for-connection-multiplier 300})
        ^ServerAddress sa (mg/server-address source-conn-host source-conn-port)
        conn (mg/connect sa opts)]
    (DateTimeZone/setDefault DateTimeZone/UTC)
    conn
    ))

(defn db [db-name]
  (mg/get-db source-conn db-name))

=======
(ns kaleido.source.mongodb
  (:require [monger.core :as mg])
  (:import [com.mongodb MongoOptions ServerAddress]))

(def source-conn-host "localhost")

(def source-conn-port 27017)

(def source-conn
  (let [^MongoOptions opts (mg/mongo-options {:threads-allowed-to-block-for-connection-multiplier 300})
        ^ServerAddress sa (mg/server-address source-conn-host source-conn-port)
        conn (mg/connect sa opts)]
    conn
    ))

(defn db [db-name]
  (mg/get-db source-conn db-name))

>>>>>>> 12fa5dab22f60feb5ea0a9495816cfe6c11acf0d
