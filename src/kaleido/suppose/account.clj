(ns kaleido.suppose.account
  (:use digest monger.json)
  (:require [kaleido.setting :as app-setting]
            [compojure.core :refer :all]
            [kaleido.tools :refer :all]
            [clojure.tools.logging :as log]
            [kaleido.source.mongodb :as db-source]
            [monger.collection :as mc]
            [monger.conversion :refer [from-db-object]]))

(declare auth gen-password get-by-name create change)

(def default-role "normal")

(defn auth
  [login-name login-password salt project]
  (let [find-account (get-by-name login-name project)
        account-password (:login_password find-account)]
    (log/info find-account)
    (log/info (str "acount's password -> " account-password))
    (if (empty? find-account)
      {:status false :message "empty account" :account {}}
      (let [real-code-password (digest/md5 (str account-password salt))
            login-status (= real-code-password login-password)
            message (if login-status "success" "wrong password")]
        (log/info (str "real-code-password : " real-code-password))
        (log/info "-")
        (log/info (str "login-password : " login-password))
        {:status (= real-code-password login-password) :message message :account (if login-status find-account {})}))
    )
  )

;project-db (if (> (count project) 0) project app-setting/system-db)

(defn get-by-name
  [name project]
  (let [db (db-source/db project)
        coll app-setting/system-auth
        mg-object (mc/find-one db coll {:login_name name})
        account (from-db-object mg-object true)]
    (log/warn "GET-BY-NAME : " name account)
    account))

(defn create
  [account project]
  (if (empty? (:login_password account))
    {:status false :message "missing password"}
    (let [find-account (get-by-name (:login_name account) project)]
      ;(log/info "find-account => ")
      ;(log/info find-account)
      ;(log/info "empty? => " (empty? find-account))
      (if (empty? find-account)
        (let [db (db-source/db app-setting/system-db)
              coll app-setting/system-auth
              update-pw-account (assoc account :login_password (gen-password (:login_password account)))
              insert-account (if (empty? (:role update-pw-account)) (assoc update-pw-account :role default-role) update-pw-account)]
          (mc/insert db coll insert-account)
          ;(log/info (get-by-name {:login_name account}))
          {:status true :value (dissoc insert-account :_id :login_password)})
        {:status false :message "account is existed"}
        ))))

(defn destory
  [account project]
  (let [find-account (get-by-name (:login_name account) project)]
    (if (empty? find-account)
      {:status false :message "account not found"}
      (let [db (db-source/db app-setting/system-db)
            coll app-setting/system-auth
            oid (.toString (:_id find-account))]
        (mc/remove-by-id db coll (:_id find-account))
        {:status true :value oid}))))

(defn change
  "if password is empty, then don't change password. Else would change it to new password."
  [account project]
  (if (empty? (:login_name account))
    {:status false :message "account name is empty"}
    (let [find-account (get-by-name (:login_name account) project)]
      (if (empty? find-account)
        {:status false :message "account not found"}
        (let [db (db-source/db app-setting/system-db)
              coll app-setting/system-auth
              ; password was encode because md5 it with salt when auth
              up-pw-account (if (empty? (:login_password account)) account (assoc account :login_password (:login_password account)))]
          ;(log/info (.toString (:_id find-account)))
          (log/info find-account)
          (mc/update-by-id db coll up-pw-account find-account)
          {:status true :value (dissoc (merge find-account up-pw-account) :_id :login_password)})))
    ))

(defn gen-password
  [password]
  (digest/md5 password))



