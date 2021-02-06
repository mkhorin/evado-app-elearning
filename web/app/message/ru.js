'use strict';
/**
 * Extend default translations
 *
 * Use: Jam.t('Some text')
 * Use: <span data-t="">Some text</span>
 * Use: <div title="Some text" data-t=""></div>
 * Use: <input placeholder="Some text" type="text" data-t="">
 */
Object.assign(Jam.I18n.defaults, {

    'Create tasks': 'Создать задания',
    'Create tasks for all students': 'Создать задания для всех студентов',
});

// METADATA

Jam.I18n.meta = {

    'All tasks': 'Все задания',
    'Answer': 'Ответ',

    'Check': 'Проверять',
    'Check this task back': 'Проверить задание снова',
    'Checking': 'Проверяется',
    'Checking tasks': 'На проверке',
    'Closed': 'Закрыто',
    'Comment': 'Комментарий',
    'Comment file': 'Файл комментария',
    'Comments': 'Комментарии',
    'Complete': 'Завершить',
    'Complete task': 'Закрыть задание',
    'Content': 'Содержимое',

    'Description': 'Описание',
    'Draft': 'Черновик',
    'Draft tasks': 'Черновики',

    'Edit': 'Править',

    'File': 'Файл',
    'Files': 'Файлы',

    'Grade': 'Оценка',

    'Lesson': 'Урок',
    'Lessons': 'Уроки',

    'Materials': 'Материалы',

    'Name': 'Название',

    'Pending': 'Ожидает проверки',
    'Pending tasks': 'Ожидают проверки',
    'People': 'Люди',

    'Question': 'Вопрос',
    'Question file': 'Файл вопроса',
    'Questions': 'Вопросы',

    'Ready': 'Готово',
    'Recheck': 'Перепроверить',
    'Return this task to work': 'Вернуть задание на доработку',
    'Rework': 'Доработать',

    'Start task checking': 'Начать проверку задания',
    'State': 'Состояние',
    'Student': 'Студент',
    'Students': 'Студенты',
    'Submit this task for review': 'Отправить задание на проверку',

    'Teacher': 'Учитель',
    'Teachers': 'Учителя',
    'Task': 'Задание',
    'Tasks': 'Задания',
    'Text': 'Текст',

    'User': 'Пользователь'
};

Jam.I18n['meta.class.task.attr.grade'] = {

    'Bad': 'Плохо',
    'Good': 'Хорошо',
    'None': 'Нет',
    'Satisfactory': 'Удовлетворительно',
    'Superior': 'Отлично',
};