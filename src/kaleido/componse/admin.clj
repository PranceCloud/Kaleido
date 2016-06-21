<<<<<<< HEAD
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
=======
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
>>>>>>> 12fa5dab22f60feb5ea0a9495816cfe6c11acf0d
      (route-auth/app-inner-auth-routes))))