(ns kaleido.componse.admin
  (:use kaleido.tools)
  (:require [kaleido.tools :refer :all]
            [kaleido.suppose.project :as project-model]
            [monger.operators :refer :all]
            [compojure.core :refer :all]
            [clojure.tools.logging :as log]
            [kaleido.componse.auth :as route-auth]
            [ring.util.response :refer [response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

(declare projects)

(defn projects
  [require]
  (response-json (project-model/get-all-name)))

(defn app-inner-admin-routes []
  (routes
    (GET "/" require (str "m" (get-in require [:params :_id]) "!"))
    (GET "/projects" require (projects require))
    (context "/auth" []
      (route-auth/app-inner-auth-routes))))