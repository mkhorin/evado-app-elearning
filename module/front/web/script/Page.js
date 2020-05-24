'use strict';

Front.Page = class Page extends Front.Element {

    init () {
        this.name = this.getData('page');
        this.front.on('show:page', this.onPage.bind(this));
    }

    onPage (event, data) {
        if (this.name === data.name) {
            this.activate(data);
        }
    }

    activate () {
        this.front.togglePage(this.name);
    }

    showPage () {
        this.front.showPage(this.name, ...arguments);
    }
};

Front.MainPage = class MainPage extends Front.Page {
};

Front.LessonPage = class LessonPage extends Front.Page {

    init () {
        super.init();
        this.lesson = this.getHandler('Lesson');
        this.front.on('action:lesson', this.onLesson.bind(this));
    }

    onLesson (event, {lesson}) {
        this.showPage();
        this.lesson.setInstance(lesson);
    }
};

Front.QuestionPage = class QuestionPage extends Front.Page {

    init () {
        super.init();
        this.question = this.getHandler('Question');
        this.front.on('action:question', this.onQuestion.bind(this));
    }

    onQuestion (event, {question}) {
        this.showPage();
        this.question.setInstance(question);
    }
};

Front.AccountPage = class AccountPage extends Front.Page {

    init () {
        super.init();
        this.list = this.getHandler('TaskList');
        this.front.on('action:account', this.onAccount.bind(this));
    }

    activate () {
        super.activate();
        this.list.load();
    }

    onAccount (event) {
        this.showPage();
    }
};

Front.TaskPage = class TaskPage extends Front.Page {

    init () {
        super.init();
        this.task = this.getHandler('Task');
        this.front.on('action:task', this.onTask.bind(this));
    }

    onTask (event, {task}) {
        this.showPage();
        this.task.setTask(task);
    }
};

Front.CommentPage = class CommentPage extends Front.Page {

    init () {
        super.init();
        this.comment = this.getHandler('Comment');
        this.front.on('action:comment', this.onComment.bind(this));
    }

    onComment (event, {task, comment}) {
        this.showPage();
        this.find('[data-action="task"]').attr('data-id', task);
        this.comment.setComment(comment, task);
    }
};