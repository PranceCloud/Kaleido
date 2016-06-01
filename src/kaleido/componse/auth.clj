(ns kaleido.componse.auth
  (:require [kaleido.tools :refer :all]
            [kaleido.suppose.account :as account]
    ;[monger.core :as mg]
    ;[monger.collection :as mc]
            [monger.operators :refer :all]
            [compojure.core :refer :all]
    ;[kaleido.source.mongodb :as db-source]
            [clojure.tools.logging :as log]
            [ring.util.response :refer [response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  )

(declare login logout)

(defn login [require project-id]
  (log/info (:login_name (:params require)))
  (let [params (:params require)
        login_name (:login_name params)
        login_password (:login_password params)
        salt (:csrf params)
        auth_login (account/auth login_name login_password salt)
        auth_status (:status auth_login)
        auth_account (dissoc (:account auth_login) :_id :login_password)]
    (log/info params)
    (if (= auth_status true)
      (let [session (:session require)]
        ;(log/info (str "session => " session))
        ;(log/info {:message (str auth_status) :value auth_account})
        (assoc session :account auth_account)))
    (response-json {:status auth_status :message (:message auth_login) :value auth_account}))
  )

(defn logout [require project-id]
  (-> (response-json {:status true})
      (assoc :session nil)))

(defn change [require project-id]
  (let [params (:params require)
        login_name (:login_name params)
        login_password (:login_password params)
        change-account (account/change {:login_name login_name :login_password login_password})]
    (log/info change-account)
    (response-json change-account)))

(defn create [require project-id]
  (let [params (:params require)
        login_name (:login_name params)
        login_password (:login_password params)
        create-account (account/create {:login_name login_name :login_password login_password})]
    (log/info "create-account => ")
    (log/info params)
    (response-json create-account)))

(defn destory [require project-id]
  (let [params (:params require)
        login_name (:login_name params)
        req (account/destory {:login_name login_name})]
    (response-json req)))

(defn app-inner-auth-routes [project-id]
  (routes
    (GET "/api" [] (str "API " project-id))
    (POST "/login" request (login request project-id))
    (DELETE "/destory" request (destory request project-id))
    (POST "/create" request (create request project-id))
    (POST "/update" request (change request project-id))
    (POST "/logout" request (logout request project-id))))