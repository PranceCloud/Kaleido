(defproject kaleido "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://www.91here.com/hong2"
  :license {:name "Eclipse Public License"
            :url  "http://www.eclipse.org/legal/epl-v10.html"}
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [hiccup "1.0.5"]
                 [digest "1.4.4"]
                 [compojure "1.5.0"]
                 ;[ring.middleware.logger "0.5.0"]
                 [org.clojure/tools.logging "0.3.1"]
                 [cheshire "5.6.1"]
                 [ring/ring-json "0.4.0"]
                 ;[org.immutant/web "2.0.2"]
                 [com.novemberain/monger "3.0.2"]
                 [ring/ring-defaults "0.2.0"]
                 [ring/ring-anti-forgery "1.0.1"]
                 [ring/ring-devel "1.4.0"]
                 [clj-http "2.2.0"]
                 [clj-time "0.11.0"]
                 [ring/ring-jetty-adapter "1.4.0"]]
  :plugins [[lein-ring "0.9.7"]]
  ;:ring {:core hong2-lein.core/app}
  :ring {:handler       kaleido.core/app
         :auto-reload?  true
         :auto-refresh? true}
  :main ^:skip-aot hong2-lein.core
  :repl-options {:init-ns hong2-lein.core}
  :profiles {:uberjar {:aot :all}
             :dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                                  [ring/ring-mock "0.3.0"]]}})
