// 文件名称: animate_region
//
// 创 建 人: chenshy
// 创建日期: 2015/7/22 18:29
// 描    述: 负责页间转场动画
define([
    'marionette',
    'common/base/ViewManager'
], function (Marionette, viewManager) {

    var defaultAnimation = "cover";
    return Marionette.Region.extend({
        show: function (viewClass, options) {
            var self = this;

            if (!self._ensureElement()) {
                return;
            }
            if (window.isTransing) {
                return;
            }

            var view = viewManager.getViewInstance(viewClass, options);

            window.isTransing = true;

            self._isReverse = false;

            self._ensureViewIsIntact(view);

            //如果是不同的view或者强制显示下一个view,才显示下一个view
            var _shouldShowView = view !== self.currentView;

            self.showingView = view;

            if (_shouldShowView) {

                if (!view.isRendered) {
                    view.render();
                    view.isRendered = true;
                }

                if (!view.el.parentNode) {
                    self.openView(view);
                }

                view._parent = self;

                //动画
                view.$el.addClass("initLeft_100");
                if (view.show) {
                    view.show();
                }
                _.delay(function () {
                    self.changePage(self.currentView, view);
                }, 0);

                return self;
            } else {
                window.isTransing = false;
            }
            return self;
        },

        /**
         * 关闭视图
         * @param view
         */
        closeView: function (view) {

        },

        /**
         * 打开视图
         * @param view
         */
        openView: function (view) {
            this.el.appendChild(view.el);
        },

        changePage: function (fromPage, toPage) {
            var self = this;
            self._pageCount = 0;
            self._a_ended = 0;
            if (fromPage) {
                self._pageCount++;
                self.animationEndOn(fromPage);
            }
            if (toPage) {
                self._pageCount++;
                self.animationEndOn(toPage);
            }
            self.transition(fromPage, toPage);
        },

        transition: function (fromPage, toPage) {
            var self = this;

            var reverse = self._isReverse = Backbone.history.isBackHistory();

            var reverseClass = reverse ? " reverse" : "";

            var $el;

            var name;

            if (reverse) {
                name = fromPage ? fromPage.getOption("page-animation") : "";
            } else {
                name = toPage ? toPage.getOption("page-animation") : "";
            }

            var animation = Backbone.history.getAnimation();

            if (animation) {
                name = animation;
            }

            if (!name) {
                name = defaultAnimation;
            }

            var zIndex = 10;
            if (fromPage) {
                zIndex = Number(fromPage.$el.css("zIndex"));
            }

            if (fromPage) {
                $el = fromPage.$el;
                $el.css("z-index", reverse ? "10" : "9").addClass(name + " out" + reverseClass);
            }

            if (toPage) {
                $el = toPage.$el;
                $el.css("z-index", reverse ? "9" : "10").addClass(name + " in" + reverseClass);
                $el.removeClass("hide");
                $el.addClass("show");
            }
        },
        /*
         * 动画完成之后
         * page : 指定的触发页面
         */
        animationEndOn: function (page) {
            var self = this;
            page.$el.one("webkitAnimationEnd", function (e) {
                self._pageCount--;
                var $el = $(this);
                var ino = $el.attr("class");
                $el.addClass("hide");
                if (ino.indexOf(" in") > 0) {
                    $el.removeClass();
                    $el.addClass("ui_view_transitioning ui_page");
                } else {
                    $el.removeClass(function (index, oldclass) {
                        return oldclass.replace(/hide/, " ");
                    });
                    $el.addClass("ui_view_transitioning ui_page hide");
                }

                if (self._a_ended == 0) {
                    self.animationEnd();

                }

                self._a_ended++;
            });
        },

        __empty: function () {
            this.empty();

        },

        animationEnd: function () {
            var self = this;
            window.isTransing = false;
            if (self.currentView) {
                delete self.currentView._parent;
                if (self.currentView.close) {
                    self.currentView.close();
                }
                var forever = self.currentView.getOption("forever");
                if (forever === false) {
                    viewManager.destroyView(self.currentView);
                } else if (forever === true) {
                } else {
                }

                self.currentView = null;
                delete self.currentView;
            }

            self.currentView = self.showingView;
            if (self.showingView && self.showingView.pageIn) {
                self.showingView.pageIn();
            }

            self.showingView = null;
            delete self.showingView;
        }
    });
});