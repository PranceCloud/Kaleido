(ns kaleido.componse.debug
  (:use kaleido.tools
        hiccup.core)
  (:require [kaleido.tools :refer :all]
            [kaleido.setting :refer :all]
    ;[monger.operators :refer :all]
            [compojure.core :refer :all]
    ;[compojure.route :as rt]
            [clojure.tools.logging :as log]
    ;[ring.util.request :as request]
            [ring.util.response :refer [response resource-response]]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

(declare exist-routes)

(defn- index
  [request]
  (html [:head
         [:meta {:http-equiv "content-type"
                 :content    "text/html;charset=utf-8"}]
         [:meta {:http-equiv "X-UA-Compatible"
                 :content    "IE=edge,chrome=1"}]
         [:meta {:name    "viewport"
                 :content "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"}]
         [:link {:href "//cdn.css.net/libs/bootswatch/3.3.6/lumen/bootstrap.min.css"
                 :rel  "stylesheet"
                 :type "text/css"}]
         [:script {:src "//cdn.css.net/libs/jquery/2.2.4/jquery.min.js"}]
         [:script {:src "//cdn.css.net/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"}]
         [:title "DEBUG"]]
        [:body
         [:div {:class "navbar navbar-default navbar-fixed-top"}
          [:div.container
           [:div.navbar-header
            [:a.navbar-brand {:href "."} (str "Kaleido " -version)]
            [:button.navbar-toggle {:type "button" :data-toggle "collapse" :data-target "#navbar-main"}
             [:span.icon-bar] [:span.icon-bar] [:span.icon-bar]]]
           [:div#navbar-main.navbar-collapse.collapse
            [:ul.nav.navbar-nav
             [:li.dropdown [:a#themes.dropdown-toggle {:data-toggle "dropdown" :href "#"}
                            "PROJECTS"
                            [:span.caret]]
              [:ul.dropdown-menu {:aria-labelledby "themes"}
               [:li [:a {:href ""} "ROOT"]]]]
             [:li [:a {:href ""} "HELP"]]]
            [:ul {:class "nav navbar-nav navbar-right"}
             [:li [:a {:href "http://www.91here.com/kaleido"} "LINK ME"]]]]]]
         [:div.container {:style "margin-top:60px;"}
          "FEFE"]
         ]
        ))

(defn exist-routes
  [require]
  (str require))

(defn app-inner-debug-routes []
  (routes
    (GET "/" request (index request))
    (GET "/routes" request (exist-routes request))))