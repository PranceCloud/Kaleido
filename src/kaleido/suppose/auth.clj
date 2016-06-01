(ns kaleido.suppose.auth
  (:use digest)
  (:require [kaleido.setting :as app-setting]
            [compojure.core :refer :all]
            [kaleido.tools :refer :all]
            [clojure.tools.logging :as log]
            [kaleido.source.mongodb :as db-source]
            [monger.collection :as mc]
            [monger.conversion :refer [from-db-object]]))

(declare auth login gen-password)

(defn auth
  [login-name login-password salt]
  (let [db (db-source/db app-setting/system-db)
        coll app-setting/system-auth
        mg-object (mc/find-one db coll {:login_name login-name})
        find-account (from-db-object mg-object true)]
    (log/info find-account)
    (log/info (:login_password find-account))
    (if (empty? find-account)
      false
      (let [account-password (:login_password find-account)
            real-code-password (digest/md5 (str account-password salt))]
        (= real-code-password login-password)))
    )
  )

(defn gen-password
  [password]
  (digest/md5 password))

(defn login [require]
  (log/info (:login_name (:params require)))
  (response-json {:message "show model!!!" :name (:login_name (:params require))}))

(defn logout [require]
  (response-json {:message "show model!" :name "fe"}))

(defn app-inner-auth-routes []
  (routes
    (POST "/login" request (login request))
    (POST "/logout" request (logout request))))
