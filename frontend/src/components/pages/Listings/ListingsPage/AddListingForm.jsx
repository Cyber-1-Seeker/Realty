import {useState, useEffect} from 'react';
import {Form, Input, Button, Select, Switch, Upload, Steps, message} from 'antd';
import {
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
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [propertyType, setPropertyType] = useState('apartment');

    // Определение констант для типов
    const propertyTypes = [
        {value: 'apartment', label: 'Квартира'},
        {value: 'apartments', label: 'Апартаменты'},
        {value: 'studio', label: 'Студия'},
        {value: 'house', label: 'Дом'},
        {value: 'townhouse', label: 'Таунхаус'},
    ];

    const bathroomTypes = [
        {value: 'separate', label: 'Раздельный'},
        {value: 'combined', label: 'Совмещенный'},
        {value: 'multiple', label: 'Несколько санузлов'},
    ];

    const renovationTypes = [
        {value: 'rough', label: 'Черновая'},
        {value: 'clean', label: 'Чистовая'},
        {value: 'euro', label: 'Евроремонт'},
        {value: 'design', label: 'Дизайнерский'},
        {value: 'partial', label: 'Частичный ремонт'},
    ];

    const viewTypes = [
        {value: 'yard', label: 'Двор'},
        {value: 'street', label: 'Улица'},
        {value: 'park', label: 'Парк'},
        {value: 'river', label: 'Река'},
        {value: 'city', label: 'Вид на город'},
    ];

    const dealTypes = [
        {value: 'sale', label: 'Продажа'},
        {value: 'rent', label: 'Аренда'},
        {value: 'rent_daily', label: 'Посуточная аренда'},
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
                setFormValues(prev => ({...prev, ...values}));
                setCurrentStep(currentStep + 1);
            })
            .catch(error => {
                console.log('Validation Errors:', error.errorFields);
                message.error('Пожалуйста, заполните все обязательные поля');
            });
    };

    // Возврат к предыдущему шагу
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // Валидатор для площадей
    const validateArea = (_, value) => {
        if (!value) return Promise.resolve();

        if (value <= 0) {
            return Promise.reject('Площадь должна быть положительным числом');
        }
        if (value >= 10000) {
            return Promise.reject('Слишком большое число');
        }

        return Promise.resolve();
    };

    const validateYear = (_, value) => {
        if (!value) return Promise.resolve();
        const year = parseInt(value);
        if (isNaN(year)) return Promise.reject('Введите корректный год');
        if (year < 1800) return Promise.reject('Год должен быть не ранее 1800');
        if (year > 2100) return Promise.reject('Год не может быть позже 2100');
        return Promise.resolve();
    };

    // Валидатор для цены
    const validatePrice = (_, value) => {
        if (!value) return Promise.reject('Введите цену');

        const cleanedValue = String(value)
            .replace(/[^\d,.]/g, '')
            .replace(',', '.');

        const price = parseFloat(cleanedValue);

        if (isNaN(price)) {
            return Promise.reject('Введите корректное число');
        }

        if (price <= 0) {
            return Promise.reject('Цена должна быть положительной');
        }

        if (price > 1e27) {
            return Promise.reject('Цена слишком большая');
        }

        return Promise.resolve();
    };

    const validateFloor = (_, value) => {
        if (!value) return Promise.resolve();
        if (value < 0) return Promise.reject('Этаж не может быть отрицательным');
        if (value > 32767) return Promise.reject('Слишком большое значение этажа');
        return Promise.resolve();
    };

    // Обработчик отправки формы
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const lastStepValues = await form.validateFields();
            const allValues = {...formValues, ...lastStepValues};

            const formData = new FormData();
            if (user?.id) formData.append('owner', user.id);

            const numericFields = [
                'total_area', 'floor', 'total_floors', 'rooms', 'price',
                'living_area', 'kitchen_area', 'balcony', 'deposit',
                'construction_year', 'last_renovation_year'
            ];

            const cleanNumberValue = (value) => {
                if (value === undefined || value === null || value === '') return null;
                const cleaned = String(value)
                    .replace(/[^\d,.-]/g, '')
                    .replace(',', '.');
                const numValue = parseFloat(cleaned);
                return isNaN(numValue) ? null : numValue;
            };

            for (const [key, value] of Object.entries(allValues)) {
                if (key === 'images') continue;

                if (numericFields.includes(key)) {
                    const cleanedValue = cleanNumberValue(value);
                    if (cleanedValue !== null) {
                        formData.append(key, cleanedValue);
                    }
                } else if (key === 'bargain') {
                    formData.append(key, value ? 'true' : 'false');
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            }

            if (!allValues.bathroom_type) formData.append('bathroom_type', 'combined');
            if (!allValues.renovation) formData.append('renovation', 'clean');
            if (!allValues.view) formData.append('view', 'yard');
            if (!allValues.deal_type) formData.append('deal_type', 'sale');
            if (allValues.balcony === undefined) formData.append('balcony', 0);

            if (allValues.images?.length) {
                allValues.images.forEach(file => {
                    if (file.originFileObj) {
                        formData.append('images', file.originFileObj, file.name);
                    }
                });
            }

            const response = await API_AUTH.post('/api/apartment/apartments/', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });

            message.success('Объявление успешно добавлено!');
            if (onSuccess) onSuccess(response.data);
            if (onClose) onClose();
        } catch (error) {
            console.error('Ошибка:', error);
            let errorMessage = 'Не удалось добавить объявление';

            if (error.response) {
                if (error.response.data) {
                    errorMessage = Object.values(error.response.data)
                        .flat()
                        .join(', ');
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Определение, нужно ли поле "Этаж"
    const showFloorFields = () => {
        return ['apartment', 'apartments', 'studio', 'townhouse'].includes(propertyType);
    };

    // Компонент для шага с ценой
    const PriceStep = () => {
        const dealType = Form.useWatch('deal_type', form);

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
                    rules={[{validator: validatePrice}]}
                >
                    <Input
                        placeholder="₽"
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^\d,]/g, '');
                            form.setFieldsValue({price: value});
                        }}
                    />
                </Form.Item>

                {(dealType === 'rent' || dealType === 'rent_daily') && (
                    <Form.Item
                        name="deposit"
                        label="Залог (₽)"
                        rules={[
                            {required: true, message: 'Введите залог'},
                            {validator: validatePrice}
                        ]}
                    >
                        <Input
                            placeholder="₽"
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d,]/g, '');
                                form.setFieldsValue({deposit: value});
                            }}
                        />
                    </Form.Item>
                )}

                <Form.Item
                    name="utilities"
                    label="Коммунальные платежи"
                    rules={[{max: 100, message: 'Максимальная длина 100 символов'}]}
                >
                    <Input placeholder="Например: 5000 ₽ в месяц"/>
                </Form.Item>

                <Form.Item
                    name="bargain"
                    label="Возможен торг"
                    valuePropName="checked"
                >
                    <Switch/>
                </Form.Item>
            </>
        );
    };


    // Рендер шагов формы
    const renderFormStep = () => {
        switch (currentStep) {
            case 0: // Основное
                return (
                    <>
                        <Form.Item
                            name="property_type"
                            label="Тип недвижимости"
                            rules={[{required: true, message: 'Выберите тип недвижимости'}]}
                        >
                            <Select
                                placeholder="Выберите тип"
                                onChange={value => setPropertyType(value)}
                            >
                                {propertyTypes.map(type => (
                                    <Option key={type.value} value={type.value}>{type.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Адрес"
                            rules={[
                                {required: true, message: 'Введите адрес'},
                                {max: 255, message: 'Максимальная длина адреса 255 символов'}
                            ]}
                        >
                            <Input placeholder="Город, улица, дом" autoFocus/>
                        </Form.Item>

                        <Form.Item
                            name="title"
                            label="Заголовок объявления"
                            rules={[
                                {required: true, message: 'Введите заголовок'},
                                {max: 100, message: 'Максимум 100 символов'}
                            ]}
                        >
                            <Input placeholder="Например: Светлая 2-комн. квартира в новом доме"/>
                        </Form.Item>

                        <Form.Item
                            name="total_area"
                            label="Общая площадь (м²)"
                            rules={[
                                {required: true, message: 'Введите площадь'},
                                {validator: validateArea}
                            ]}
                        >
                            <Input type="number" min="0.01" step="0.01" placeholder="м²"/>
                        </Form.Item>

                        {showFloorFields() && (
                            <>
                                <Form.Item
                                    name="floor"
                                    label="Этаж"
                                    tooltip={
                                        propertyType === 'house' || propertyType === 'townhouse'
                                            ? 'Для домов и таунхаусов можно указать основной этаж'
                                            : 'На каком этаже расположен объект'
                                    }
                                    rules={[
                                        {pattern: /^\d+$/, message: 'Введите целое число'},
                                        {
                                            required: !['house', 'townhouse'].includes(propertyType),
                                            message: 'Введите этаж'
                                        },
                                        {validator: validateFloor}
                                    ]}
                                >
                                    <Input type="number" min="0" placeholder="Например: 1"/>
                                </Form.Item>

                                <Form.Item
                                    name="total_floors"
                                    label="Этажность здания"
                                    tooltip={
                                        propertyType === 'house' || propertyType === 'townhouse'
                                            ? 'Общее количество этажей в здании'
                                            : 'Сколько всего этажей в доме'
                                    }
                                    rules={[
                                        {pattern: /^\d+$/, message: 'Введите целое число'},
                                        {
                                            required: !['house', 'townhouse'].includes(propertyType),
                                            message: 'Введите этажность'
                                        },
                                        {validator: validateFloor}
                                    ]}
                                >
                                    <Input type="number" min="1" placeholder="Например: 5"/>
                                </Form.Item>
                            </>
                        )}
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
                                {min: 0, message: 'Не может быть отрицательным'},
                                {max: 10, message: 'Слишком большое количество комнат'}
                            ]}
                        >
                            <Input type="number" min="0" placeholder="0 для студии"/>
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
                            rules={[
                                {pattern: /^\d+$/, message: 'Введите целое число'},
                                {max: 4, message: 'Слишком большое количество'},
                            ]}
                        >
                            <Input type="number" min="0" placeholder="Количество"/>
                        </Form.Item>

                        <Form.Item
                            name="living_area"
                            label="Жилая площадь (м²)"
                            rules={[{validator: validateArea}]}
                        >
                            <Input type="number" min="0" step="0.01" placeholder="м²"/>
                        </Form.Item>

                        <Form.Item
                            name="kitchen_area"
                            label="Площадь кухни (м²)"
                            rules={[{validator: validateArea}]}
                        >
                            <Input type="number" min="0" step="0.01" placeholder="м²"/>
                        </Form.Item>

                        <Form.Item
                            name="construction_year"
                            label="Год постройки"
                            rules={[{validator: validateYear}]}
                        >
                            <Input type="number" placeholder="Год постройки"/>
                        </Form.Item>

                        <Form.Item
                            name="last_renovation_year"
                            label="Год ремонта"
                            rules={[{validator: validateYear}]}
                        >
                            <Input type="number" placeholder="Год последнего ремонта"/>
                        </Form.Item>
                    </>
                );

            case 2: // Цена
                return <PriceStep/>;

            case 3: // Описание
                return (
                    <>
                        <Form.Item
                            name="description"
                            label="Описание"
                            rules={[
                                {required: true, message: 'Введите описание'},
                                {max: 500, message: 'Максимальная длина описания 500 символов'}
                            ]}
                        >
                            <TextArea
                                rows={6}
                                placeholder="Опишите объект недвижимости..."
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>

                        <Form.Item
                            name="features"
                            label="Особенности"
                            rules={[{max: 500, message: 'Максимальная длина 500 символов'}]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="Ключевые особенности через запятую: кондиционер, парковка, ремонт"
                                showCount
                                maxLength={500}
                            />
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
                                beforeUpload={(file) => {
                                    const isLt10M = file.size / 1024 / 1024 < 10;
                                    if (!isLt10M) {
                                        message.error('Изображение должно быть меньше 10MB');
                                    }
                                    return false;
                                }}
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
                initialValues={{
                    deal_type: 'sale',
                    balcony: 0,
                    bargain: false
                }}
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