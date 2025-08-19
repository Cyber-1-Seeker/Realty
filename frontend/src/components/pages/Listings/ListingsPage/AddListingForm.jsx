import {useState, useEffect, useRef} from 'react';
import {Form, Input, Button, Select, Switch, Upload, Steps, ConfigProvider, theme, Tooltip, Modal, Slider, InputNumber} from 'antd';
import { useTheme } from '@/context/ThemeContext';
import {Link} from 'react-router-dom'
import {
    PlusOutlined,
    HomeOutlined,
    SettingOutlined,
    DollarOutlined,
    FileTextOutlined,
    CameraOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import styles from './AddListingForm.module.css';
import {API_AUTH} from "@/utils/api/axiosWithAuth.js";

const {Option} = Select;
const {Step} = Steps;
const {TextArea} = Input;

const AddListingForm = ({onClose: parentOnClose, onSuccess, user, theme}) => {

    // Переименовываем onClose в parentOnClose для ясности
    // Используем переданную тему или получаем из контекста
    const { theme: contextTheme } = useTheme();
    const currentTheme = theme || contextTheme;

    // Кастомный слайдер с полем ввода сверху
    const SliderWithInput = ({ name, min, max, step, tooltipFormatter, suffix, customFormatter, ...props }) => {
        const [value, setValue] = useState(min);
        
        // Отслеживаем изменения в форме
        const formValue = Form.useWatch(name, form);
        
        // Обновляем локальное состояние при изменении в форме
        useEffect(() => {
            if (formValue !== undefined && formValue !== null) {
                setValue(formValue);
            }
        }, [formValue]);
        
        const handleSliderChange = (newValue) => {
            setValue(newValue);
            // Небольшая задержка для более плавной работы
            setTimeout(() => {
                form.setFieldsValue({ [name]: newValue });
            }, 10);
        };

        const handleInputChange = (newValue) => {
            if (newValue !== null && newValue !== undefined) {
                // Автоматически ограничиваем значение согласно максимуму слайдера
                const clampedValue = Math.max(min, Math.min(max, newValue));
                setValue(clampedValue);
                form.setFieldsValue({ [name]: clampedValue });
                
                // Если введенное значение больше максимума, показываем уведомление
                if (newValue > max) {
                    Modal.info({
                        title: 'Значение ограничено',
                        content: `Максимальное значение для этого поля: ${max}${suffix || ''}`,
                    });
                }
            }
        };

        // Форматируем значение для отображения в поле
        const displayValue = customFormatter ? customFormatter(value) : value;

        return (
            <div style={{ position: 'relative', paddingTop: '50px' }}>
                {/* Поле ввода сверху справа */}
                <div style={{ 
                    position: 'absolute', 
                    top: '0', 
                    right: '0',
                    zIndex: 1
                }}>
                    {customFormatter ? (
                        <Input
                            value={displayValue}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                if (inputValue === 'Студия') {
                                    handleInputChange(0);
                                } else if (inputValue === '') {
                                    // Позволяем пустое поле
                                    setValue(0);
                                    form.setFieldsValue({ [name]: 0 });
                                } else {
                                    const numValue = parseInt(inputValue.replace(/[^\d]/g, ''));
                                    if (!isNaN(numValue)) {
                                        handleInputChange(numValue);
                                    }
                                }
                            }}
                            onBlur={() => {
                                // При потере фокуса восстанавливаем правильное значение
                                if (value === 0) {
                                    setValue(0);
                                }
                            }}
                            style={{ 
                                width: '120px',
                                backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
                                border: `1px solid ${currentTheme === 'dark' ? '#374151' : '#d9d9d9'}`,
                                borderRadius: '6px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                            placeholder="Введите значение"
                        />
                    ) : (
                        <InputNumber
                            min={min}
                            max={max}
                            step={step}
                            value={value}
                            onChange={handleInputChange}
                            style={{ 
                                width: '120px',
                                backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
                                border: `1px solid ${currentTheme === 'dark' ? '#374151' : '#d9d9d9'}`,
                                borderRadius: '6px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                            placeholder={`${min}-${max}`}
                            addonAfter={suffix}
                        />
                    )}
                </div>
                
                {/* Слайдер */}
                <Slider
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleSliderChange}
                    tooltip={{
                        formatter: tooltipFormatter,
                        placement: 'top'
                    }}
                    {...props}
                />
            </div>
        );
    };

    // Функция для создания лейбла с тултипом
    const createLabelWithTooltip = (label, tooltipText) => (
        <span>
            {label}{' '}
            <Tooltip
                title={tooltipText}
                color={currentTheme === 'dark' ? '#1f2937' : undefined}
                styles={{
                    root: {
                        fontSize: '14px',
                        maxWidth: '300px',
                        zIndex: 1100000
                    },
                    body: {
                        padding: '8px 12px',
                        color: currentTheme === 'dark' ? '#f3f4f6' : undefined,
                    }
                }}
                getPopupContainer={() => document.body} // Рендерим в корне документа
            >
                <QuestionCircleOutlined style={{ 
                    color: currentTheme === 'dark' ? '#60a5fa' : '#1890ff',
                    cursor: 'help',
                    fontSize: '16px',
                    marginLeft: '4px',
                    transition: 'all 0.3s ease',
                    opacity: 0.8
                }} />
            </Tooltip>
        </span>
    );
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [propertyType, setPropertyType] = useState('apartment');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const formContentRef = useRef(null);

    // Автоматическая прокрутка вверх при смене шага
    useEffect(() => {
        if (formContentRef.current) {
            formContentRef.current.scrollTop = 0;
        }
    }, [currentStep]);

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
            .catch(() => {
                Modal.error({
                    title: 'Ошибка заполнения',
                    content: 'Пожалуйста, заполните все обязательные поля',
                });
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
        if (value > 1000) {
            return Promise.reject('Площадь не может быть больше 1000 м²');
        }

        return Promise.resolve();
    };

    // Валидатор для цены
    const validatePrice = (_, value) => {
        if (!value || value.trim() === '') {
            return Promise.reject('Введите цену');
        }

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

        if (price > 1e9) {
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
                'total_area', 'floor', 'rooms', 'price', 'deposit',
                'living_area', 'kitchen_area'
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

            // Устанавливаем значения по умолчанию для обязательных полей
            if (!allValues.bathroom_type) formData.append('bathroom_type', 'combined');
            if (!allValues.view) formData.append('view', 'yard');
            if (!allValues.deal_type) formData.append('deal_type', 'sale');

            if (allValues.images?.length) {
                allValues.images.forEach(file => {
                    if (file.originFileObj) {
                        formData.append('images', file.originFileObj, file.name);
                    }
                });
            }

            await API_AUTH.post('/api/apartment/apartments/', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });

            // Показываем окно успеха
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Ошибка:', error);
            let errorMessage = 'Не удалось добавить объявление';

            if (error.response) {
                if (error.response.status === 413) {
                    errorMessage = 'Размер файлов слишком большой. Пожалуйста, уменьшите размер изображений или загрузите меньше файлов.';
                } else if (error.response.data) {
                    if (typeof error.response.data === 'object') {
                        errorMessage = Object.values(error.response.data)
                            .flat()
                            .join(', ');
                    } else {
                        errorMessage = error.response.data;
                    }
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            Modal.error({
                title: 'Ошибка отправки',
                content: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    // Закрытие модального окна успеха
    const handleSuccessModalClose = () => {
        // Закрываем модальное окно и вызываем колбэки
        if (parentOnClose) parentOnClose();
        if (onSuccess) onSuccess();
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
                    required
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
                                {validator: validatePrice}
                            ]}
                            required
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
                        required
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
                            label={createLabelWithTooltip(
                                "Адрес",
                                "Укажите полный адрес объекта: город, улица, номер дома. Например: Москва, ул. Ленина, д. 10"
                            )}
                            rules={[
                                {required: true, message: 'Введите адрес'},
                                {max: 255, message: 'Максимальная длина адреса 255 символов'}
                            ]}
                        >
                            <Input placeholder="Город, улица, дом" autoFocus/>
                        </Form.Item>

                        <Form.Item
                            name="total_area"
                            label={createLabelWithTooltip(
                                "Общая площадь (м²)",
                                'Укажите общую площадь помещения в квадратных метрах. Перетащите ползунок для выбора значения.'
                            )}
                            rules={[
                                {required: true, message: 'Введите площадь'},
                                {validator: validateArea}
                            ]}
                        >
                            <SliderWithInput
                                name="total_area"
                                min={0.01}
                                max={1000}
                                step={0.01}
                                tooltipFormatter={(value) => `${value} м²`}
                                suffix="м²"
                            />
                        </Form.Item>

                        {showFloorFields() && (
                            <Form.Item
                                name="floor"
                                label={createLabelWithTooltip(
                                    "Этаж",
                                    propertyType === 'house' || propertyType === 'townhouse'
                                        ? 'Для домов и таунхаусов можно указать основной этаж'
                                        : 'На каком этаже расположен объект'
                                )}
                                rules={[
                                    {
                                        required: !['house', 'townhouse'].includes(propertyType),
                                        message: 'Введите этаж'
                                    }
                                ]}
                            >
                                <SliderWithInput
                                    name="floor"
                                    min={0}
                                    max={100}
                                    step={1}
                                    tooltipFormatter={(value) => `${value} этаж`}
                                    suffix="этаж"
                                />
                            </Form.Item>
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
                                {required: true, message: 'Введите количество комнат'}
                            ]}
                        >
                            <SliderWithInput
                                name="rooms"
                                min={0}
                                max={20}
                                step={1}
                                tooltipFormatter={(value) => value === 0 ? 'Студия' : `${value} комн.`}
                                suffix=""
                                customFormatter={(value) => value === 0 ? 'Студия' : `${value} комн.`}
                            />
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
                            name="living_area"
                            label="Жилая площадь (м²)"
                            rules={[{validator: validateArea}]}
                        >
                            <SliderWithInput
                                name="living_area"
                                min={0}
                                max={800}
                                step={0.01}
                                tooltipFormatter={(value) => `${value} м²`}
                                suffix=" м²"
                            />
                        </Form.Item>

                        <Form.Item
                            name="kitchen_area"
                            label="Площадь кухни (м²)"
                            rules={[{validator: validateArea}]}
                        >
                            <SliderWithInput
                                name="kitchen_area"
                                min={0}
                                max={200}
                                step={0.01}
                                tooltipFormatter={(value) => `${value} м²`}
                                suffix=" м²"
                            />
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
                                    // Проверка размера файла (10MB)
                                    const isLt10M = file.size / 1024 / 1024 < 10;
                                    if (!isLt10M) {
                                        Modal.error({
                                            title: 'Ошибка',
                                            content: 'Изображение должно быть меньше 10MB',
                                        });
                                        return false;
                                    }

                                    // Проверка типа файла
                                    const isImage = file.type.startsWith('image/');
                                    if (!isImage) {
                                        Modal.error({
                                            title: 'Ошибка',
                                            content: 'Можно загружать только изображения',
                                        });
                                        return false;
                                    }

                                    // Проверка общего размера всех файлов (50MB)
                                    const totalSize = fileList.reduce((sum, f) => sum + (f.size || 0), 0) + file.size;
                                    const isTotalSizeOk = totalSize / 1024 / 1024 < 50;
                                    if (!isTotalSizeOk) {
                                        Modal.error({
                                            title: 'Ошибка',
                                            content: 'Общий размер всех файлов не должен превышать 50MB',
                                        });
                                        return false;
                                    }

                                    return false; // Предотвращаем автоматическую загрузку
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

    // Настройки темы для Ant Design
    const darkThemeConfig = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorBgContainer: '#111827',
            colorBgElevated: '#111827',
            colorBorder: '#374151',
            colorText: '#f3f4f6',
            colorTextPlaceholder: '#9ca3af',
            colorPrimary: '#3b82f6',
            colorBgTextHover: '#1f2937',
            colorBgTextActive: '#374151',
            borderRadius: 6,
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            colorTextDescription: '#e5e7eb', // Для счетчика символов
        },
        components: {
            Select: {
                colorBgContainer: '#111827',
                colorBorder: '#374151',
                colorText: '#f3f4f6',
                colorTextPlaceholder: '#9ca3af',
                colorBgElevated: '#111827',
                controlItemBgHover: '#1f2937',
                controlItemBgActive: '#374151',
                colorPrimary: '#3b82f6',
            },
            Input: {
                colorTextDescription: '#e5e7eb', // Для счетчика символов в Input.TextArea
            },
        },
    };

    const renderSuccessContent = () => (
        <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
                <CheckCircleOutlined/>
            </div>

            <h2 className={styles.modalTitle}>Объявление отправлено на модерацию!</h2>

            <div className={styles.modalCard}>
                <ClockCircleOutlined className={styles.clockIcon}/>
                <div>
                    <h3>Ожидайте проверки</h3>
                    <p>Наши модераторы проверяют ваше объявление. Обычно это занимает менее 24 часов.</p>
                </div>
            </div>

            <div className={styles.modalCard}>
                <div className={styles.badge}>1</div>
                <div>
                    <h3>Что проверяется?</h3>
                    <p>Достоверность информации, соответствие требованиям сервиса и качество фотографий.</p>
                </div>
            </div>

            <div className={styles.modalCard}>
                <div className={styles.badge}>2</div>
                <div>
                    <h3>После проверки</h3>
                    <p>В профиле у объявления будет статус "Опубликовано".</p>
                </div>
            </div>

            <div className={styles.modalFooter}>
                <Button
                    type="primary"
                    onClick={handleSuccessModalClose}
                    className={styles.modalButton}
                >
                    Понятно
                </Button>
                <p className={styles.supportText}>
                    Вопросы? <Link to="/support">Обратитесь в поддержку</Link>
                </p>
            </div>
        </div>
    );

    const renderFormContent = () => (
        <>
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
                <div
                    className={styles.formContent}
                    ref={formContentRef}
                >
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
        </>
    );

    return (
        <ConfigProvider
            theme={currentTheme === 'dark' ? darkThemeConfig : undefined}
        >
            <div className={`${styles.container} ${currentTheme === 'dark' ? styles.dark : ''}`}>
                {showSuccessModal ? renderSuccessContent() : renderFormContent()}
            </div>
        </ConfigProvider>
    );
};

export default AddListingForm;