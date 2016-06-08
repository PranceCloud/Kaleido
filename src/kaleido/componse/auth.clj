(ns kaleido.componse.auth
  (:require [kaleido.tools :refer :all]
            [kaleido.suppose.account :as account]
            [monger.operators :refer :all]
            [compojure.core :refer :all]
            [clojure.tools.logging :as log]
            [ring.util.response :refer [response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
    ;[monger.core :as mg]
    ;[monger.collection :as mc]
    ;[kaleido.source.mongodb :as db-source]
            [kaleido.setting :as app-setting]))

(declare login logout)

(defn login [require]
  (log/info (:login_name (:params require)))
  (log/info (get-in require [:params :_id]))
  (let [params (:params require)
        project (if (empty? (:_id params)) app-setting/system-db (:_id params))
        login_name (:login_name params)
        login_password (:login_password params)
        salt (:csrf params)
        auth_login (account/auth login_name login_password salt project)
        auth_status (:status auth_login)
        auth_account (dissoc (:account auth_login) :_id :login_password)
        session (:session require)]
    (log/info (str "!!!!!!!!" project))
    (if (= auth_status true)
      (let [session (assoc session :account {project {:auth auth_account}})]
        (-> (response-json {:status auth_status :message (:message auth_login) :value auth_account})
            (assoc :session session)))
      (response-json {:status auth_status :message (:message auth_login) :value auth_account})
      )
    )
  )

(defn logout []
  (-> (response-json {:status true})
      (assoc :session nil)))

(defn change [require]
  (let [params (:params require)
        project (if (empty? (:_id params)) app-setting/system-db (:_id params))
        login_name (:login_name params)
        login_password (:login_password params)
        change-account (account/change {:login_name login_name :login_password login_password} project)]
    (log/info change-account)
    (response-json change-account)))

(defn create [require]
  (let [params (:params require)
        project (if (empty? (:_id params)) app-setting/system-db (:_id params))
        login_name (:login_name params)
        login_password (:login_password params)
        create-account (account/create {:login_name login_name :login_password login_password} project)]
    (log/info "create-account => ")
    (log/info params)
    (response-json create-account)))

(defn destory [require]
  (let [params (:params require)
        project (if (empty? (:_id params)) app-setting/system-db (:_id params))
        login_name (:login_name params)
        req (account/destory {:login_name login_name} project)]
    (response-json req)))

(defn app-inner-auth-routes []
  (routes
    (GET "/api" require (str "API !" (get-in require [:params :_id]) "!"))
    (POST "/login" require (login require))
    (DELETE "/destory" require (destory require))
    (POST "/create" require (create require))
    (POST "/update" require (change require))
    (GET "/logout" [] (logout))))