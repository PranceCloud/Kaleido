<<<<<<< HEAD
(ns kaleido.tools
  (:require [compojure.core :refer :all]
    ;[clojure.tools.logging :as log]
            [cheshire.core :refer :all]
            [ring.middleware.json :refer [wrap-json-response]]
            [ring.middleware.json :refer [wrap-json-params]]
            [ring.util.response :refer [header response]]
            [ring.middleware.resource :refer :all]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  )

(defn response-json
  [body]
  (header (response body) "Content-Type" "application/json"))

(defn fliter-key-in-array
  [f-keys v-array]
  (into []
        (map #(into {} (filter (fn [[k _]] (contains? f-keys k)) %)) v-array))
  )
=======
(ns kaleido.tools
  (:require [compojure.core :refer :all]
    ;[clojure.tools.logging :as log]
            [cheshire.core :refer :all]
            [ring.middleware.json :refer [wrap-json-response]]
            [ring.middleware.json :refer [wrap-json-params]]
            [ring.util.response :refer [header response]]
            [ring.middleware.resource :refer :all]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  )

(defn response-json
  [body]
  (header (response body) "Content-Type" "application/json"))
>>>>>>> 12fa5dab22f60feb5ea0a9495816cfe6c11acf0d
