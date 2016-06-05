(ns kaleido.componse.admin
  (:use kaleido.tools)
  (:require [kaleido.tools :refer :all]
            [monger.operators :refer :all]
            [compojure.core :refer :all]
            [clojure.tools.logging :as log]
            [kaleido.componse.auth :as route-auth]
            [ring.util.response :refer [response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

(declare projects)

(defn projects
  [require]
  (str require))

(defn app-inner-admin-routes []
  (routes
    (GET "/" [] (str "m"))
    (GET "/projects" require (projects require))
    (context "/auth" []
      (route-auth/app-inner-auth-routes))))