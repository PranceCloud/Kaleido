(ns kaleido.core-test
  (:use midje.sweet
        digest)
  (:require [clojure.test :refer :all]
            [kaleido.core :refer :all]
            [cheshire.core :refer :all]
            [kaleido.setting :refer :all]
            [clj-http.client :as client]))

(def host "http://127.0.0.1:3000")
(def manager-root-name "admin")
(def manager-root-password "test")

(def web-http-url (str host "/"))
(def web-csrf-url (str host "/csrf"))
(def manager-test-url (str host manager-url))
(def manager-auth-test-url (str host manager-url "/auth/login"))
(def project-test-url (str host manager-url "/projects"))

(deftest web-http-test
  (fact (str "Web Server " web-http-url)
        (let [g (client/get web-http-url)]
          (:status g) => 200)))

(defn get-csrf
  [c]
  (let [c (client/get web-csrf-url {:cookie-store c})]
    (:csrf (parse-string (:body c) true))))

(defn parse-json-string
  [s]
  (parse-string s true))

(defn system-auth-login
  [user-name user-password]
  (let [my-cs (clj-http.cookies/cookie-store)
        csrf (get-csrf my-cs)
        en-password (digest/md5 (str (digest/md5 user-password) csrf))
        g (client/post
            manager-auth-test-url
            {:headers      {"X-CSRF-Token" csrf}
             :form-params  {:login_name user-name :login_password en-password :csrf csrf}
             :cookie-store my-cs})]
    g))


(deftest csrf-test
  (let [my-cs (clj-http.cookies/cookie-store)
        csrf (get-csrf my-cs)]
    (is (> (count (str csrf)) 10))))

(deftest manager-auth-test
  (fact "Manager Auth Login"
        (let [right-login (system-auth-login manager-root-name manager-root-password)
              bad-login (system-auth-login manager-root-name (str manager-root-password "1"))]
          (fact "Login Request?"
                (:status right-login) => 200 => true)
          (fact "Login Right Success?"
                (:status (parse-json-string (:body right-login))) => true)
          (fact "Login Bad Success?"
                (:status (parse-json-string (:body bad-login))) => false)
          )))

(deftest manager-test
  (fact (str "Manager Root " manager-test-url)
        (let [g (client/get manager-test-url)]
          (:status g) => 200)))

(deftest project-test
  (fact (str "Project Root " host project-test-url)
        (let [g (client/get project-test-url)]
          (:status g) => 200)))