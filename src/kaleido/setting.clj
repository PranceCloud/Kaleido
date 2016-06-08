(ns kaleido.setting
  (:gen-class))

(def -version "0.0.1")

(def base-url (str "/"))
(def manager-url (str "/m"))
(def debug-url  "/debug")
(def project-prefix-url "/project")

(def system-db (str "kaleido"))
(def system-auth "Account")
(def system-project "Project")

;(def system-session (str "Session"))
