var home = new Vue({
    el: "#app",
    data: {
        loading: true,
        scrolling: $(window).scrollTop(),
        open: false,
        activeLink: 'home',
        home: null,
        news: null,
        events: null,
        about: null,
        gallery: null,
        partners: null,
        library: null,
        gallery_images: null,
        partner_images: null,
        serverPath: 'http://cms.streetsportsincubator.org/',
        about_pages: {
            activeList: "about_the_incubator",
            aboutTabs: null,
            aboutContent: null,
        },
        newsPage: {
            activeList: "news",
            newsList: null,
            eventsList: null,
            detailedNews: null,
        },
        library_resources: {
            activeList: 'library',
            libraryList: null,
        },
        sub: {
            activeList: null,
            libraryList: null,
        },
        contactPage: {
            first_name: null,
            sure_name: null,
            email: null,
            phone: null,
            country: null,
            business: null,
            topic: null,
            message: null,
        },
        registerPage: {
            //values
        },
        subscribe: {
            email: null,
        },
        footer: {
            contact_info: null,
        }
    },
    created: function () {
        this.setValues();
        if (this.activeLink == 'home') {
            this.getHome();
        }
        this.getFooter();
    },
    methods: {
        setValues() {
            if (window.location.href.indexOf("about-detailed") > 0) {
                this.getِAbout();
                this.activeLink = "about";
                if (this.readQueryString('activeList')) {
                    this.about_pages.activeList = this.readQueryString('activeList');
                }
            }
            if (window.location.href.indexOf("news-events-lists") > 0) { //summary page
                this.getNews();
                this.activeLink = "news";
                if (this.readQueryString('activeList')) {
                    this.newsPage.activeList = this.readQueryString('activeList');
                }
            }
            if (window.location.href.indexOf("news-detailed") > 0) { //detailed news page
                this.getNews();
                this.activeLink = "news-detailed";
            }


            if (window.location.href.indexOf("library-list") > 0) {
                this.getNews();
                this.activeLink = "library";
                if (this.readQueryString('activeList')) {
                    this.library_resources.activeList = this.readQueryString('activeList');
                }
            }
            if (window.location.href.indexOf("contacts") > 0) {
                this.getHome();
                this.activeLink = "contacts";
            }
            if (window.location.href.indexOf("registration") > 0) {
                this.loading = false;
                this.activeLink = "registration";
            }
        },
        getHome() {
            var self = this;
            this.loading = true;
            axios.get("http://cms.streetsportsincubator.org/en/api/home")
                .then(function (response) {
                    self.home = response.data.data.home;
                    self.news = response.data.data.news;
                    self.events = response.data.data.events;
                    self.about = response.data.data.about;
                    self.gallery = response.data.data.gallery;
                    self.partner_images = response.data.data.partner_images;
                    self.about_pages.aboutTabs = response.data.data.about_pages;
                    self.gallery_images = response.data.data.gallery_images;
                    self.partners = response.data.data.partners;
                    self.library = response.data.data.library;
                    self.library_resources.libraryList = response.data.data.library_resources;
                    self.loading = false;
                    setTimeout(() => {
                        if (self.activeLink == 'home') {
                            self.initPhotoAblum();
                            self.scrollToSection();
                            $(function () {
                                $("a[href*='#']:not([href='#'])").click(function (e) {
                                    e.preventDefault();
                                    setTimeout(() => {
                                        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                                            home.scrollToSection(e.target.hash);
                                        }
                                    }, 100);

                                });
                            });
                        }
                    }, 300);

                })
        },
        getNews() {
            var self = this;
            this.loading = true;
            axios.get("http://cms.streetsportsincubator.org/en/api/news")
                .then(function (response) {
                    self.newsPage.newsList = response.data.news;
                    axios.get("http://cms.streetsportsincubator.org/en/api/events")
                        .then(function (response) {
                            self.newsPage.eventsList = response.data.data.events;
                            axios.get("http://cms.streetsportsincubator.org/en/api/library")
                                .then(function (response) {
                                    self.loading = false;
                                    self.library_resources.libraryList = response.data.data.resources;
                                    if (self.activeLink == 'news-detailed') {
                                        self.newsPage.activeList = self.readQueryString('page-type');
                                        if (self.readQueryString('news-id')) {
                                            self.getDetailedNews(self.readQueryString('news-id'), self.readQueryString('page-type'));
                                        }
                                    }
                                })
                        })
                })
        },
        getDetailedNews(newsId, pageType) {
            if (pageType == 'events') {
                newsList = this.newsPage.eventsList;
            } else if (pageType == 'news') {
                newsList = this.newsPage.newsList;
            } else if (pageType == 'library') {
                newsList = this.library_resources.libraryList;
            }
            this.newsPage.detailedNews = newsList.filter(obj => {
                return obj.id === parseInt(newsId);
            })
        },
        getِAbout() {
            var self = this;
            this.loading = true;
            axios.get("http://cms.streetsportsincubator.org//en/api/about/pages")
                .then(function (response) {
                    self.about_pages.aboutContent = response.data.data.pages;
                    self.loading = false;
                })
        },
        getFooter() {
            var self = this;
            axios.get("http://cms.streetsportsincubator.org/en/api/contact-us/info")
                .then(function (response) {
                    self.footer.contact_info = response.data.data;
                })
        },
        initPhotoAblum() {
            $('.home-photoAlbum').slick({
                infinite: false,
                slidesToShow: 3,
                slidesToScroll: 4,
                dots: true,
                prevArrow: false,
                nextArrow: false,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                            arrows: false,
                            centerPadding: '30px',
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                            arrows: false,
                            centerPadding: '20px',
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            arrows: true,
                            centerMode: true,
                            centerPadding: '30px',
                            slidesToShow: 1,
                            dots: true,
                        }
                    }
                ]
            });
            $('.home-about').slick({
                infinite: false,
                slidesToShow: 3,
                slidesToScroll: 3,
                dots: false,
                prevArrow: false,
                nextArrow: false,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                            arrows: false,
                            centerPadding: '30px',
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            arrows: false,
                            centerPadding: '30px',
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            arrows: false,
                            centerMode: true,
                            centerPadding: '0px',
                            slidesToShow: 1,
                            dots: true,
                        }
                    }
                ]
            });
            $('.home-partners').slick({
                infinite: false,
                slidesToShow: 4,
                slidesToScroll: 4,
                dots: true,
                prevArrow: false,
                nextArrow: false,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                            arrows: false,
                            centerPadding: '30px',
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                            arrows: false,
                            centerPadding: '20px',
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            arrows: false,
                            centerMode: true,
                            centerPadding: '30px',
                            slidesToShow: 1,
                            dots: true,
                        }
                    }
                ]
            });
            $('.home-library').slick({
                infinite: false,
                slidesToShow: 4,
                slidesToScroll: 4,
                dots: true,
                prevArrow: false,
                nextArrow: false,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                            arrows: false,
                            centerPadding: '30px',
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                            arrows: false,
                            centerPadding: '20px',
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            arrows: true,
                            centerMode: true,
                            centerPadding: '30px',
                            slidesToShow: 1,
                            dots: true,
                        }
                    }
                ]
            });
        },
        scrollTop() {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        },
        scrollToSection(hash) {
            var target = '';
            if (hash) {
                target = $(hash);
            } else {
                target = $(window.location.hash);
            }
            if (target.length) {
                $('html,body').stop().animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        },
        readQueryString(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        },
        validateForm(form) {
            var self = this;
            $(form).find('input[req]').each(function () {
                if ($(this).val() == '') {
                    $(this).addClass('red');
                } else {
                    $(this).removeClass('red');
                }
                if ($(this).attr('type') == 'email') {
                    if (self.validateEmail($(this).val())) {
                        $(this).removeClass('red');
                    } else {
                        $(this).addClass('red');
                    }
                }
            })
            $(form).find('input[number]').each(function () {
                var phoneNum = $('#phone-reg').val();
                var phoneLen = phoneNum.length
                if (phoneLen < 10) {
                    $(this).addClass('red');
                } else {
                    $(this).removeClass('red');
                }
            })
            $(form).find('textarea[req]').each(function () {
                if ($(this).val() == '') {
                    $(this).addClass('red');
                } else {
                    $(this).removeClass('red');
                }
            })
            $(form).find('select[req]').each(function () {
                if ($(this).val() < 1) {
                    $(this).addClass('red');
                } else {
                    $(this).removeClass('red');
                }
            })
            if ($('.red').length > 0) {
                return false;
            } else {
                //ajax
                return true;
            }
        },
        validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },
        postContact(form) {
            if (this.validateForm(form)) {
                var postBody = this.contactPage;
                axios.post(this.serverPath + 'contact-us/save', postBody)
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error.response);
                    });
            }
        },
        postRegister(form) {
            alert(form)
            if (this.validateForm(form)) {
                var postBody = this.registerPage;
                axios.post(this.serverPath + 'registration/save', postBody)
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        this.scrollTop(0, 0);
                        console.log(error);
                    });
            }
        },
        subscription(form) {
            if (this.validateForm(form)) {
                var postBody = this.subscribe;
                axios.post(this.serverPath + 'en/api/newsletter/subscribe', postBody)
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
    }
});
$('.data.dragged').on('click', function () {
    $(this).removeClass('dragged');
});

function goBack() {
    window.history.back();
}

function debounce(fn, wait) {
    var time = Date.now();
    return function () {
        var context = this,
            args = arguments;
        if ((time + wait - Date.now()) < 0) {
            fn.apply(context, args);
            time = Date.now();
        }
    }
}

if (home.activeLink == 'home') {
    window.location.hash = home.activeLink;
    $('body').on('mousewheel', debounce(function (event) {
        if (event.deltaY > 0) { //going up
            $('html,body').stop().animate({
                scrollTop: $(window).scrollTop() - $(window).height()
            }, 1000);
        } else {
            $('html,body').stop().animate({
                scrollTop: $(window).scrollTop() + $(window).height()
            }, 1000);
        }
    }, 2100));
    $(document).keydown(function (e) {
        if (e.which == 40) {
            $('html,body').stop().animate({
                scrollTop: $(window).scrollTop() + $(window).height()
            }, 1000);
        } else if (e.which == 38) {
            $('html,body').stop().animate({
                scrollTop: $(window).scrollTop() - $(window).height()
            }, 1000);
        }
    });
}
$(document).bind('scroll', function () {
    $('section').each(function () {
        if ($(this).offset().top < window.pageYOffset + 10 && $(this).offset().top + $(this).height() > window.pageYOffset + 10) {
            var urlChanged = $(this).attr('id');
            window.location.hash = urlChanged;
            home.activeLink = urlChanged;
        }
        if (window.location.hash === '#sub') {
            window.location.hash = 'home';
        }
        if (window.location.hash === '#home') {
            home.activeLink = 'home';
        }
    });
});