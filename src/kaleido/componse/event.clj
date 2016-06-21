<<<<<<< HEAD
(ns kaleido.componse.event
  (:use kaleido.tools)
  (:require [kaleido.tools :refer :all]
            [monger.operators :refer :all]
            [compojure.core :refer :all]
            [clojure.tools.logging :as log]
            [ring.util.response :refer [response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

(declare regist)

(defn regist
  [require]
  (str require))

(defn app-inner-event-routes []
  (routes
    (GET "/" [] (str "event"))
=======
(ns kaleido.componse.event
  (:use kaleido.tools)
  (:require [kaleido.tools :refer :all]
            [monger.operators :refer :all]
            [compojure.core :refer :all]
            [clojure.tools.logging :as log]
            [ring.util.response :refer [response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

(declare regist)

(defn regist
  [require]
  (str require))

(defn app-inner-event-routes []
  (routes
    (GET "/" [] (str "event"))
>>>>>>> 12fa5dab22f60feb5ea0a9495816cfe6c11acf0d
    (GET "/regist" require (regist require))))