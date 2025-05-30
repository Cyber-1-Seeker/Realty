import {useState, useEffect} from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    Switch,
    Upload,
    Tooltip,
    Steps,
    message
} from 'antd';
import {
    InfoCircleOutlined,
    PlusOutlined,
    HomeOutlined,
    SettingOutlined,
    DollarOutlined,
    FileTextOutlined,
    CameraOutlined
} from '@ant-design/icons';
import styles from './AddListingForm.module.css';
import {API_AUTH} from "@/utils/api/axiosWithAuth.js";

const {Option} = Select;
const {Step} = Steps;
const {TextArea} = Input;

const AddListingForm = ({onClose, onSuccess, user}) => {
    console.log(user)
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({});

    // Определение констант для типов
    const propertyTypes = [
        {value: 'apartment', label: 'Квартира'},
        {value: 'apartments', label: 'Апартаменты'},
        {value: 'studio', label: 'Студия'},
    ];

    const bathroomTypes = [
        {value: 'separate', label: 'Раздельный'},
        {value: 'combined', label: 'Совмещенный'},
    ];

    const renovationTypes = [
        {value: 'rough', label: 'Черновая'},
        {value: 'clean', label: 'Чистовая'},
        {value: 'euro', label: 'Евроремонт'},
        {value: 'design', label: 'Дизайнерский'},
    ];

    const viewTypes = [
        {value: 'yard', label: 'Двор'},
        {value: 'street', label: 'Улица'},
        {value: 'park', label: 'Парк'},
    ];

    const dealTypes = [
        {value: 'sale', label: 'Продажа'},
        {value: 'rent', label: 'Аренда'},
    ];

    // Шаги формы
    const steps = [
        {title: 'Основное', icon: <HomeOutlined/>},
        {title: 'Характеристики', icon: <SettingOutlined/>},
        {title: 'Цена', icon: <DollarOutlined/>},
        {title: 'Описание', icon: <FileTextOutlined/>},
        {title: 'Фото', icon: <CameraOutlined/>},
    ];

    // Обработчик для файлов
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    // Переход к следующему шагу
    const nextStep = () => {
        form.validateFields()
            .then(values => {
                console.log(`Шаг ${currentStep} значения:`, values);
                setFormValues(prev => ({...prev, ...values}));
                setCurrentStep(currentStep + 1);
            })
            .catch(error => {
                console.log('Validation Error:', error);
                message.error('Пожалуйста, заполните все обязательные поля');
            });
    };

    // Возврат к предыдущему шагу
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // Валидатор для площадей (не более 4 цифр до запятой)
    const validateArea = (_, value) => {
        if (!value) return Promise.resolve();

        const stringValue = value.toString();
        const [wholePart] = stringValue.split('.');

        if (wholePart.length > 4) {
            return Promise.reject('Максимум 4 цифры до запятой');
        }

        return Promise.resolve();
    };

    // Валидатор для целых чисел (не более 4 цифр)
    const validateInteger = (_, value) => {
        if (!value) return Promise.resolve();

        const stringValue = value.toString();

        if (stringValue.length > 4) {
            return Promise.reject('Максимум 4 цифры');
        }

        return Promise.resolve();
    };

    // Обработчик отправки формы
    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Получаем значения последнего шага
            const lastStepValues = await form.validateFields();

            // Объединяем все значения формы
            const allValues = {...formValues, ...lastStepValues};
            console.log('Все значения формы:', allValues);

            const formData = new FormData();

            // Добавляем владельца объявления
            if (user?.id) {
                formData.append('owner', user.id);
                console.log('Добавлен владелец:', user.id);
            } else {
                throw new Error('Пользователь не определен');
            }

            // Список числовых полей
            const numericFields = [
                'total_area', 'floor', 'total_floors', 'rooms', 'price',
                'living_area', 'kitchen_area', 'balcony', 'deposit',
                'construction_year', 'last_renovation_year'
            ];

            // Добавляем все поля с преобразованием типов
            for (const [key, value] of Object.entries(allValues)) {
                if (key === 'images') continue;

                if (numericFields.includes(key)) {
                    // Преобразуем в число
                    if (value !== undefined && value !== null && value !== '') {
                        formData.append(key, Number(value));
                    }
                } else if (key === 'bargain') {
                    // Булево значение
                    formData.append(key, value ? 'true' : 'false');
                } else {
                    // Все остальные поля
                    if (value !== undefined && value !== null) {
                        formData.append(key, value);
                    }
                }
            }

            // Установка значений по умолчанию
            if (!allValues.bathroom_type) formData.append('bathroom_type', 'combined');
            if (!allValues.renovation) formData.append('renovation', 'clean');
            if (!allValues.view) formData.append('view', 'yard');
            if (!allValues.deal_type) formData.append('deal_type', 'sale');
            if (allValues.balcony === undefined) formData.append('balcony', 0);

            // Добавляем изображения
            if (allValues.images?.length) {
                allValues.images.forEach(file => {
                    if (file.originFileObj) {
                        formData.append('images', file.originFileObj);
                    }
                });
            }

            // Отладочный вывод
            console.log('Содержимое FormData:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            // Отправка данных
            const response = await API_AUTH.post('/api/apartment/apartments/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            message.success('Объявление успешно добавлено!');
            if (onSuccess) onSuccess(response.data);
            if (onClose) onClose();
        } catch (error) {
            console.error('Полная ошибка:', error);
            if (error.response) {
                console.error('Данные ответа:', error.response.data);
                console.error('Статус ответа:', error.response.status);
            }
            message.error(error.response?.data?.message || error.message || 'Не удалось добавить объявление');
        } finally {
            setLoading(false);
        }
    };

    // Рендер шагов формы
    const renderFormStep = () => {
        // Устанавливаем значения формы из сохраненных данных

        switch (currentStep) {
            case 0: // Основное
                return (
                    <>
                        <Form.Item
                            name="property_type"
                            label="Тип недвижимости"
                            rules={[{required: true, message: 'Выберите тип недвижимости'}]}
                        >
                            <Select placeholder="Выберите тип">
                                {propertyTypes.map(type => (
                                    <Option key={type.value} value={type.value}>{type.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Адрес"
                            rules={[{required: true, message: 'Введите адрес'}]}
                        >
                            <Input placeholder="Город, улица, дом"/>
                        </Form.Item>

                        <Form.Item
                            name="title"
                            label="Заголовок объявления"
                            rules={[{required: true, message: 'Введите заголовок'}]}
                        >
                            <Input placeholder="Например: Светлая 2-комн. квартира в новом доме"/>
                        </Form.Item>

                        <Form.Item
                            name="total_area"
                            label="Общая площадь (м²)"
                            rules={[
                                {required: true, message: 'Введите площадь'},
                                {pattern: /^\d+(\.\d{1,2})?$/, message: 'Введите корректное число'},
                                {validator: validateArea}
                            ]}
                        >
                            <Input type="number" min="1" step="0.01" placeholder="м²"/>
                        </Form.Item>

                        <Form.Item
                            name="floor"
                            label="Этаж"
                            rules={[
                                {required: true, message: 'Введите этаж'},
                                {pattern: /^\d+$/, message: 'Введите целое число'},
                                {validator: validateInteger}
                            ]}
                        >
                            <Input type="number" min="0" placeholder="Этаж"/>
                        </Form.Item>

                        <Form.Item
                            name="total_floors"
                            label="Этажность дома"
                            rules={[
                                {required: true, message: 'Введите этажность'},
                                {pattern: /^\d+$/, message: 'Введите целое число'},
                                {validator: validateInteger}
                            ]}
                        >
                            <Input type="number" min="1" placeholder="Всего этажей"/>
                        </Form.Item>
                    </>
                );

            case 1: // Характеристики
                return (
                    <>
                        <Form.Item
                            name="rooms"
                            label="Количество комнат"
                            rules={[
                                {required: true, message: 'Введите количество комнат'},
                                {pattern: /^\d+$/, message: 'Введите целое число'},
                                {validator: validateInteger}
                            ]}
                        >
                            <Input type="number" min="1" placeholder="Количество комнат"/>
                        </Form.Item>

                        <Form.Item
                            name="bathroom_type"
                            label="Санузел"
                            rules={[{required: true, message: 'Выберите тип санузла'}]}
                        >
                            <Select placeholder="Выберите тип">
                                {bathroomTypes.map(type => (
                                    <Option key={type.value} value={type.value}>{type.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="renovation"
                            label="Ремонт"
                            rules={[{required: true, message: 'Выберите тип ремонта'}]}
                        >
                            <Select placeholder="Выберите тип ремонта">
                                {renovationTypes.map(type => (
                                    <Option key={type.value} value={type.value}>{type.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="view"
                            label="Вид из окна"
                            rules={[{required: true, message: 'Выберите вид из окна'}]}
                        >
                            <Select placeholder="Выберите вид">
                                {viewTypes.map(type => (
                                    <Option key={type.value} value={type.value}>{type.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="balcony"
                            label="Балкон/лоджия"
                            initialValue={0}
                            rules={[{validator: validateInteger}]}
                        >
                            <Input type="number" min="0" placeholder="Количество"/>
                        </Form.Item>

                        <Form.Item
                            name="living_area"
                            label="Жилая площадь (м²)"
                            rules={[
                                {pattern: /^\d+(\.\d{1,2})?$/, message: 'Введите корректное число'},
                                {validator: validateArea}
                            ]}
                        >
                            <Input type="number" min="1" step="0.01" placeholder="м²"/>
                        </Form.Item>

                        <Form.Item
                            name="kitchen_area"
                            label="Площадь кухни (м²)"
                            rules={[
                                {pattern: /^\d+(\.\d{1,2})?$/, message: 'Введите корректное число'},
                                {validator: validateArea}
                            ]}
                        >
                            <Input type="number" min="1" step="0.01" placeholder="м²"/>
                        </Form.Item>

                        <Form.Item
                            name="construction_year"
                            label="Год постройки"
                            rules={[{validator: validateInteger}]}
                        >
                            <Input type="number" min="1900" max={new Date().getFullYear()} placeholder="Год"/>
                        </Form.Item>

                        <Form.Item
                            name="last_renovation_year"
                            label="Год ремонта"
                            rules={[{validator: validateInteger}]}
                        >
                            <Input type="number" min="1900" max={new Date().getFullYear()} placeholder="Год"/>
                        </Form.Item>
                    </>
                );

            case 2: // Цена
                return (
                    <>
                        <Form.Item
                            name="deal_type"
                            label="Тип сделки"
                            rules={[{required: true, message: 'Выберите тип сделки'}]}
                        >
                            <Select placeholder="Выберите тип сделки">
                                {dealTypes.map(type => (
                                    <Option key={type.value} value={type.value}>{type.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="Цена (₽)"
                            rules={[
                                {required: true, message: 'Введите цену'},
                                {pattern: /^\d+$/, message: 'Введите целое число'},
                                {validator: validateInteger}
                            ]}
                        >
                            <Input type="number" min="1" step="1000" placeholder="₽"/>
                        </Form.Item>

                        <Form.Item
                            name="deposit"
                            label="Залог (₽)"
                            style={{display: form.getFieldValue('deal_type') === 'rent' ? 'block' : 'none'}}
                            rules={[{validator: validateInteger}]}
                        >
                            <Input type="number" min="0" placeholder="₽"/>
                        </Form.Item>

                        <Form.Item
                            name="utilities"
                            label="Коммунальные платежи"
                        >
                            <Input placeholder="Например: 5000 ₽ в месяц"/>
                        </Form.Item>

                        <Form.Item
                            name="bargain"
                            label="Возможен торг"
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Switch/>
                        </Form.Item>
                    </>
                );

            case 3: // Описание
                return (
                    <>
                        <Form.Item
                            name="description"
                            label="Описание"
                            rules={[{required: true, message: 'Введите описание'}]}
                        >
                            <TextArea rows={4} placeholder="Опишите квартиру..."/>
                        </Form.Item>

                        <Form.Item
                            name="features"
                            label="Особенности"
                        >
                            <TextArea rows={2} placeholder="Ключевые особенности через запятую"/>
                        </Form.Item>
                    </>
                );

            case 4: // Фото
                return (
                    <>
                        <Form.Item
                            name="images"
                            label="Фотографии"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            rules={[{required: true, message: 'Загрузите хотя бы одно фото'}]}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={({fileList}) => setFileList(fileList)}
                                beforeUpload={() => false}
                                multiple
                                maxCount={20}
                                accept="image/*"
                            >
                                {fileList.length >= 20 ? null : (
                                    <div>
                                        <PlusOutlined/>
                                        <div style={{marginTop: 8}}>Загрузить</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </>
                );

            default:
                return null;
        }
    };
    useEffect(() => {
        form.setFieldsValue(formValues);
    }, [currentStep, formValues]); // Зависимости от currentStep и formValues
    return (
        <div className={styles.container}>
            <Steps current={currentStep} className={styles.steps}>
                {steps.map((step, index) => (
                    <Step key={index} title={step.title} icon={step.icon}/>
                ))}
            </Steps>

            <Form
                form={form}
                layout="vertical"
                className={styles.form}
                onFinish={currentStep === steps.length - 1 ? handleSubmit : nextStep}
            >
                <div className={styles.formContent}>
                    {renderFormStep()}
                </div>

                <div className={styles.formActions}>
                    {currentStep > 0 && (
                        <Button onClick={prevStep} className={styles.prevButton}>
                            Назад
                        </Button>
                    )}

                    {currentStep < steps.length - 1 ? (
                        <Button type="primary" htmlType="submit" className={styles.nextButton}>
                            Далее
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={styles.submitButton}
                            loading={loading}
                        >
                            Опубликовать
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default AddListingForm;