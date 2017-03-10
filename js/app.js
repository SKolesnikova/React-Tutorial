window.ee = new EventEmitter();

var my_news = [
    {
        author: 'Саша Печкин',
        text: 'В четверг, четвертого числа...',
        description: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
    },
    {
        author: 'Просто Вася',
        text: 'Считаю, что $ должен стоить 35 рублей!',
        description: 'А евро 42!'
    },
    {
        author: 'Гость',
        text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
        description: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
    }
];

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            description: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function() {
        return {
            visible: false
        };
    },
    readmoreClick: function(e) {
        // debugger
        if (e.preventDefault().lenght > 0){
            this.setState({visible: true})
        } else {
            this.setState({visible: false})
        }
    },

    render: function() {
        var author = this.props.data.author,
            text = this.props.data.text,
            description = this.props.data.description,
            visible = this.state.visible;

        return (
            <div className='article'>
                <p className='news__author'>{author}:</p>
                <p className='news__text'>{text}</p>
                <a href="#" onClick={this.readmoreClick} className={'news__readmore ' + (visible ? 'none': '')}> Подробнее </a>
                <p className={'news__big-text ' + (visible ? '': 'none')}>{description}</p>
            </div>
        )
    }
});

var Add = React.createClass({
    getInitialState: function() {
        return {
            agreeNotChecked: true,
            authorIsEmpty: true,
            textIsEmpty: true,
            descIsEmpty: true
        };
    },
    componentDidMount: function() {
        ReactDOM.findDOMNode(this.refs.author).focus();
    },
    onBtnClickHandler: function(e) {
        e.preventDefault();
        var textEl = ReactDOM.findDOMNode(this.refs.text);
        var descriptionEL = ReactDOM.findDOMNode(this.refs.description);

        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var description = ReactDOM.findDOMNode(this.refs.description).value;
        
        var text = textEl.value;

        var item = [{
            author: author,
            text: text,
            description: description
        }];

        window.ee.emit('News.add', item);

        textEl.value = '';
        descriptionEL.value = '';

        this.setState({textIsEmpty: true, descIsEmpty: true});  //сгенерируй событие 'News.add' и передай в качестве данных - item.
    },

    onCheckRuleClick: function(e) {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    },
    onFieldChange: function(fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({[''+fieldName]:false})
        } else {
            this.setState({[''+fieldName]:true})
        }
    },
    render: function() {
        var agreeNotChecked = this.state.agreeNotChecked,
            authorIsEmpty = this.state.authorIsEmpty,
            textIsEmpty = this.state.textIsEmpty,
            descIsEmpty = this.state.descIsEmpty;
        return (
            <form className='add cf'>
                <input type='text' className='add__author' onChange={this.onFieldChange.bind(this, 'authorIsEmpty')} placeholder='Ваше имя' ref='author' />

                <textarea className='add__text' onChange={this.onFieldChange.bind(this, 'textIsEmpty')} placeholder='Аннотация' ref='text'></textarea>

                <textarea className='add__text' onChange={this.onFieldChange.bind(this, 'descIsEmpty')} placeholder='Полный текст' ref='description'></textarea>

                <label className='add__checkrule'>
                    <input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick}/>Я согласен с правилами
                </label>

                <button className='add__btn' onClick={this.onBtnClickHandler} ref='alert_button' disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}>
                    Добавить новость
                </button>

            </form>
        );
    }
});

var News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    getInitialState: function() {
        return {
            counter: 0
        }
    },
    render: function() {
        var data = this.props.data;
        var newsTemplate;

        if (data.length > 0) {
            newsTemplate = data.map(function(item, index) {
                return (
                    <div key={index}>
                        <Article data={item} />
                    </div>
                )
            })
        } else {
            newsTemplate = <p>К сожалению новостей нет</p>
        }

        return (
            <div className='news'>
                {newsTemplate}
                <strong
                    className={'news__count ' + (data.length > 0 ? '':'none') }>Всего новостей: {data.length}</strong>
            </div>
        );
    }
});

var App = React.createClass({
    getInitialState: function() {
        return {
            news: my_news
        };
    },

    componentDidMount: function() {
        var self = this;
        window.ee.addListener('News.add', function(item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },

    componentWillUnmount: function() {
        window.ee.removeListener('News.add');
    },

    render: function() {
        console.log('render');
        return (
            <div className='app'>
                <Add />
                <h3>Новости</h3>
                <News data={this.state.news} />
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);