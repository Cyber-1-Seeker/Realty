import {useState} from 'react';
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
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const steps = [
        {title: 'Основное', icon: <HomeOutlined/>},
        {title: 'Характеристики', icon: <SettingOutlined/>},
        {title: 'Цена', icon: <DollarOutlined/>},
        {title: 'Описание', icon: <FileTextOutlined/>},
        {title: 'Фото', icon: <CameraOutlined/>},
    ];

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Валидируем и получаем все значения формы
            const values = await form.validateFields();
            console.log('Form values after validation:', values);

            // Проверяем, что user существует
            if (!user?.id) {
                throw new Error('Пользователь не определен');
            }

            const formData = new FormData();
            formData.append('owner', user.id);

            // Список полей, которые нужно преобразовать в числа
            const numericFields = [
                'total_area', 'living_area', 'kitchen_area', 'floor',
                'total_floors', 'rooms', 'balcony', 'price', 'deposit',
                'construction_year', 'last_renovation_year'
            ];

            // Список булевых полей
            const booleanFields = ['bargain'];

            // Добавляем все поля формы
            Object.entries(values).forEach(([name, value]) => {
                if (name === 'images') return; // Изображения обработаем отдельно

                if (numericFields.includes(name)) {
                    // Преобразуем числовые поля
                    formData.append(name, Number(value));
                } else if (booleanFields.includes(name)) {
                    // Булевы значения
                    formData.append(name, value ? 'true' : 'false');
                } else {
                    // Все остальные поля
                    formData.append(name, value);
                }
            });

            // Добавляем изображения
            if (values.images?.length) {
                values.images.forEach(file => {
                    if (file.originFileObj) {
                        formData.append('images', file.originFileObj);
                    }
                });
            }

            // Отладочный вывод содержимого FormData
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await API_AUTH.post('/api/apartment/apartments/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            message.success('Объявление успешно добавлено!');
            onSuccess(response.data);
            onClose();
        } catch (error) {
            console.error('Full error:', error);
            message.error(error.response?.data?.message || error.message || 'Не удалось добавить объявление');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        form.validateFields()
            .then(() => setCurrentStep(currentStep + 1))
            .catch(error => console.log('Validation Error:', error));
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const renderInfoTooltip = (text) => (
        <Tooltip title={text}>
            <InfoCircleOutlined style={{marginLeft: 8, color: '#1890ff'}}/>
        </Tooltip>
    );

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
                            extra={renderInfoTooltip('Полный адрес с городом и улицей')}
                        >
                            <Input placeholder="Город, улица, дом"/>
                        </Form.Item>

                        <Form.Item
                            name="title"
                            label="Заголовок объявления"
                            rules={[{required: true, message: 'Введите заголовок'}]}
                            extra={renderInfoTooltip('Краткое и привлекающее внимание название')}
                        >
                            <Input placeholder="Например: Светлая 2-комн. квартира в новом доме"/>
                        </Form.Item>

                        <div className={styles.formRow}>
                            <Form.Item
                                name="total_area"
                                label="Общая площадь"
                                rules={[{required: true, message: 'Введите площадь'}]}
                                className={styles.formColumn}
                                extra={renderInfoTooltip('Общая площадь квартиры в м²')}
                            >
                                <Input type="number" min="1" step="0.01" placeholder="м²"/>
                            </Form.Item>

                            <Form.Item
                                name="living_area"
                                label="Жилая площадь"
                                className={styles.formColumn}
                                extra={renderInfoTooltip('Жилая площадь (необязательно)')}
                            >
                                <Input type="number" min="1" step="0.01" placeholder="м²"/>
                            </Form.Item>

                            <Form.Item
                                name="kitchen_area"
                                label="Площадь кухни"
                                className={styles.formColumn}
                                extra={renderInfoTooltip('Площадь кухни (необязательно)')}
                            >
                                <Input type="number" min="1" step="0.01" placeholder="м²"/>
                            </Form.Item>
                        </div>

                        <div className={styles.formRow}>
                            <Form.Item
                                name="floor"
                                label="Этаж"
                                rules={[{required: true, message: 'Введите этаж'}]}
                                className={styles.formColumn}
                            >
                                <Input type="number" min="0" placeholder="Этаж"/>
                            </Form.Item>

                            <Form.Item
                                name="total_floors"
                                label="Этажность дома"
                                rules={[{required: true, message: 'Введите этажность'}]}
                                className={styles.formColumn}
                            >
                                <Input type="number" min="1" placeholder="Всего этажей"/>
                            </Form.Item>
                        </div>
                    </>
                );

            case 1: // Характеристики
                return (
                    <>
                        <Form.Item
                            name="rooms"
                            label="Количество комнат"
                            rules={[{required: true, message: 'Введите количество комнат'}]}
                        >
                            <Select placeholder="Выберите количество">
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4+</Option>
                            </Select>
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
                            name="balcony"
                            label="Балкон/лоджия"
                        >
                            <Select placeholder="Выберите количество">
                                <Option value="0">Нет</Option>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3+</Option>
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

                        <div className={styles.formRow}>
                            <Form.Item
                                name="construction_year"
                                label="Год постройки"
                                className={styles.formColumn}
                            >
                                <Input
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    placeholder="Год"
                                    onChange={e => {
                                        const value = e.target.value;
                                        if (value.length <= 4) {
                                            form.setFieldsValue({construction_year: value});
                                        }
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="last_renovation_year"
                                label="Год ремонта"
                                className={styles.formColumn}
                            >
                                <Input
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    placeholder="Год"
                                    onChange={e => {
                                        const value = e.target.value;
                                        if (value.length <= 4) {
                                            form.setFieldsValue({last_renovation_year: value});
                                        }
                                    }}
                                />
                            </Form.Item>
                        </div>
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
                            label="Цена"
                            rules={[{required: true, message: 'Введите цену'}]}
                            extra={renderInfoTooltip('Цена в рублях')}
                        >
                            <Input type="number" min="1" step="1000" placeholder="₽"/>
                        </Form.Item>

                        <Form.Item
                            name="deposit"
                            label="Залог"
                            extra={renderInfoTooltip('Для аренды')}
                            style={{display: form.getFieldValue('deal_type') === 'rent' ? 'block' : 'none'}}
                        >
                            <Input type="number" min="0" placeholder="₽"/>
                        </Form.Item>

                        <Form.Item
                            name="utilities"
                            label="Коммунальные платежи"
                            extra={renderInfoTooltip('Ежемесячные платежи')}
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

            case 3: // Описание
                return (
                    <>
                        <Form.Item
                            name="description"
                            label="Описание"
                            rules={[{required: true, message: 'Введите описание'}]}
                            extra={renderInfoTooltip('Подробное описание квартиры')}
                        >
                            <TextArea rows={4} placeholder="Опишите квартиру, особенности, преимущества..."/>
                        </Form.Item>

                        <Form.Item
                            name="features"
                            label="Особенности"
                            extra={renderInfoTooltip('Ключевые особенности через запятую')}
                        >
                            <TextArea rows={2} placeholder="Например: Панорамные окна, кондиционер, паркет"/>
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
                            extra="Первое фото будет главным в объявлении"
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