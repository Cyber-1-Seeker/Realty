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

    // Компонент для переключения между точным значением и диапазоном
    const ModeToggle = ({ mode, onToggle, label, fieldName }) => {
        const handleToggle = (newMode) => {
            if (newMode === 'exact') {
                // При переключении на точное значение, берем значение "от" и устанавливаем его как точное
                const fromValue = form.getFieldValue(`${fieldName}_from`);
                if (fromValue) {
                    form.setFieldsValue({ [`${fieldName}_exact`]: fromValue });
                }
            }
            onToggle(newMode);
        };

        return (
            <div className={styles.modeToggle}>
                <span className={styles.modeToggleLabel}>{label}</span>
                <div className={styles.modeToggleButtons}>
                    <Button
                        type={mode === 'exact' ? 'primary' : 'default'}
                        size="small"
                        onClick={() => handleToggle('exact')}
                        className={styles.modeToggleButton}
                    >
                        Точное значение
                    </Button>
                    <Button
                        type={mode === 'range' ? 'primary' : 'default'}
                        size="small"
                        onClick={() => handleToggle('range')}
                        className={styles.modeToggleButton}
                    >
                        Диапазон
                    </Button>
                </div>
            </div>
        );
    };
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [propertyType, setPropertyType] = useState('apartment');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const formContentRef = useRef(null);
    const [uploadErrors, setUploadErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    // Состояния для управления режимом полей (точное значение или диапазон)
    const [totalAreaMode, setTotalAreaMode] = useState('exact'); // 'exact' или 'range'
    const [floorMode, setFloorMode] = useState('exact');
    const [totalFloorsMode, setTotalFloorsMode] = useState('exact');
    const [livingAreaMode, setLivingAreaMode] = useState('exact');
    const [kitchenAreaMode, setKitchenAreaMode] = useState('exact');

    // Отслеживаем изменения полей для валидации
    const totalAreaFrom = Form.useWatch('total_area_from', form);
    const totalAreaTo = Form.useWatch('total_area_to', form);
    const floorFrom = Form.useWatch('floor_from', form);
    const floorTo = Form.useWatch('floor_to', form);
    const totalFloorsFrom = Form.useWatch('total_floors_from', form);
    const totalFloorsTo = Form.useWatch('total_floors_to', form);
    const livingAreaFrom = Form.useWatch('living_area_from', form);
    const livingAreaTo = Form.useWatch('living_area_to', form);
    const kitchenAreaFrom = Form.useWatch('kitchen_area_from', form);
    const kitchenAreaTo = Form.useWatch('kitchen_area_to', form);
    const rooms = Form.useWatch('rooms', form);

    // Автоматическая прокрутка вверх при смене шага
    useEffect(() => {
        if (formContentRef.current) {
            formContentRef.current.scrollTop = 0;
        }
    }, [currentStep]);

    // Автоматическое обновление количества комнат при изменении типа недвижимости
    useEffect(() => {
        if (propertyType === 'studio') {
            form.setFieldsValue({ rooms: 0 });
        } else {
            form.setFieldsValue({ rooms: 1 });
        }
    }, [propertyType, form]);

    // Синхронизация между точным значением и диапазоном для общей площади
    useEffect(() => {
        if (totalAreaMode === 'exact') {
            const exactValue = form.getFieldValue('total_area_exact');
            if (exactValue) {
                form.setFieldsValue({ 
                    total_area_from: exactValue,
                    total_area_to: exactValue
                });
            }
        }
    }, [totalAreaMode, form]);

    // Синхронизация при изменении режима этажа
    useEffect(() => {
        if (floorMode === 'exact') {
            const exactValue = form.getFieldValue('floor_exact');
            if (exactValue) {
                form.setFieldsValue({ 
                    floor_from: exactValue,
                    floor_to: exactValue
                });
            }
        }
    }, [floorMode, form]);

    // Синхронизация при изменении режима этажности
    useEffect(() => {
        if (totalFloorsMode === 'exact') {
            const exactValue = form.getFieldValue('total_floors_exact');
            if (exactValue) {
                form.setFieldsValue({ 
                    total_floors_from: exactValue,
                    total_floors_to: exactValue
                });
            }
        }
    }, [totalFloorsMode, form]);

    // Синхронизация при изменении режима жилой площади
    useEffect(() => {
        if (livingAreaMode === 'exact') {
            const exactValue = form.getFieldValue('living_area_exact');
            if (exactValue) {
                form.setFieldsValue({ 
                    living_area_from: exactValue,
                    living_area_to: exactValue
                });
            }
        }
    }, [livingAreaMode, form]);

    // Синхронизация при изменении режима площади кухни
    useEffect(() => {
        if (kitchenAreaMode === 'exact') {
            const exactValue = form.getFieldValue('kitchen_area_exact');
            if (exactValue) {
                form.setFieldsValue({ 
                    kitchen_area_from: exactValue,
                    kitchen_area_to: exactValue
                });
            }
        }
    }, [kitchenAreaMode, form]);

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
                setSubmitError(''); // Очищаем ошибку отправки
            })
            .catch(() => {
                // Ошибки валидации показываются прямо в форме
                // Никаких модальных окон
            });
    };

    // Возврат к предыдущему шагу
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        setSubmitError(''); // Очищаем ошибку отправки
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
        if (value < 1) return Promise.reject('Этаж не может быть меньше 1');
        if (value > 32767) return Promise.reject('Слишком большое значение этажа');
        return Promise.resolve();
    };

    // Обработчик отправки формы
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const lastStepValues = await form.validateFields();
            const allValues = {...formValues, ...lastStepValues};

            // Валидация значений перед отправкой
            const validationErrors = [];
            
            // Проверяем минимальные значения для площадей
            if (allValues.total_area_from < 1.00) {
                validationErrors.push('Общая площадь "от" не может быть меньше 1.00 м²');
            }
            if (allValues.total_area_to < 1.00) {
                validationErrors.push('Общая площадь "до" не может быть меньше 1.00 м²');
            }
            if (allValues.living_area_from < 1.00) {
                validationErrors.push('Жилая площадь "от" не может быть меньше 1.00 м²');
            }
            if (allValues.living_area_to < 1.00) {
                validationErrors.push('Жилая площадь "до" не может быть меньше 1.00 м²');
            }
            if (allValues.kitchen_area_from < 1.00) {
                validationErrors.push('Площадь кухни "от" не может быть меньше 1.00 м²');
            }
            if (allValues.kitchen_area_to < 1.00) {
                validationErrors.push('Площадь кухни "до" не может быть меньше 1.00 м²');
            }
            
            // Проверяем минимальные значения для этажей
            if (allValues.floor_from < 1) {
                validationErrors.push('Этаж квартиры "от" не может быть меньше 1');
            }
            if (allValues.total_floors_from < 1) {
                validationErrors.push('Этажность дома "от" не может быть меньше 1');
            }
            
            // Проверяем диапазоны
            if (allValues.total_area_to < allValues.total_area_from) {
                validationErrors.push('Общая площадь "до" не может быть меньше площади "от"');
            }
            if (allValues.living_area_to < allValues.living_area_from) {
                validationErrors.push('Жилая площадь "до" не может быть меньше жилой площади "от"');
            }
            if (allValues.kitchen_area_to < allValues.kitchen_area_from) {
                validationErrors.push('Площадь кухни "до" не может быть меньше площади кухни "от"');
            }
            if (allValues.floor_to < allValues.floor_from) {
                validationErrors.push('Этаж квартиры "до" не может быть меньше этажа "от"');
            }
            if (allValues.total_floors_to < allValues.total_floors_from) {
                validationErrors.push('Этажность дома "до" не может быть меньше этажности "от"');
            }
            
            // Проверяем этаж квартиры относительно этажности дома
            if (allValues.floor_to > allValues.total_floors_to) {
                validationErrors.push('Этаж квартиры не может быть больше этажности дома');
            }
            
            // Если есть ошибки валидации, показываем их и прерываем отправку
            if (validationErrors.length > 0) {
                setSubmitError(validationErrors.join('. '));
                setLoading(false);
                return;
            }

            const formData = new FormData();
            if (user?.id) formData.append('owner', user.id);

            const numericFields = [
                'total_area_from', 'total_area_to', 'floor_from', 'floor_to', 
                'total_floors_from', 'total_floors_to', 'rooms', 'price', 'deposit',
                'living_area_from', 'living_area_to', 'kitchen_area_from', 'kitchen_area_to'
            ];

            const cleanNumberValue = (value) => {
                if (value === undefined || value === null || value === '') return null;
                
                // Если значение уже число, возвращаем его
                if (typeof value === 'number') return value;
                
                // Преобразуем в строку и убираем лишние пробелы
                const stringValue = String(value).trim();
                
                // Если пустая строка, возвращаем null
                if (stringValue === '') return null;
                
                // Заменяем запятую на точку для корректного парсинга
                const normalizedValue = stringValue.replace(',', '.');
                
                // Парсим число
                const numValue = parseFloat(normalizedValue);
                
                // Проверяем, что получилось валидное число
                if (isNaN(numValue)) return null;
                
                // Для площадей проверяем минимальное значение
                if (numValue < 1.00) {
                    console.warn('Значение меньше 1.00:', numValue);
                    return 1.00; // Возвращаем минимальное значение
                }
                
                return numValue;
            };

            for (const [key, value] of Object.entries(allValues)) {
                if (key === 'images') continue;

                if (numericFields.includes(key)) {
                    const cleanedValue = cleanNumberValue(value);
                    if (cleanedValue !== null) {
                        // Убеждаемся, что передаем число, а не строку
                        const numericValue = Number(cleanedValue);
                        // Проверяем, что значение не меньше 0.01 для площадей
                        if (key.includes('area') && numericValue < 0.01) {
                            console.warn(`Значение ${key} меньше 0.01:`, numericValue);
                        }
                        formData.append(key, numericValue);
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
        
                    // Устанавливаем значения по умолчанию для числовых полей, если они не заполнены
            if (!allValues.total_area_from || allValues.total_area_from < 1.00) {
                formData.set('total_area_from', 1.00);
            }
            if (!allValues.total_area_to || allValues.total_area_to < 1.00) {
                formData.set('total_area_to', 1.00);
            }
            if (!allValues.living_area_from || allValues.living_area_from < 1.00) {
                formData.set('living_area_from', 1.00);
            }
            if (!allValues.living_area_to || allValues.living_area_to < 1.00) {
                formData.set('living_area_to', 1.00);
            }
            if (!allValues.kitchen_area_from || allValues.kitchen_area_from < 1.00) {
                formData.set('kitchen_area_from', 1.00);
            }
            if (!allValues.kitchen_area_to || allValues.kitchen_area_to < 1.00) {
                formData.set('kitchen_area_to', 1.00);
            }

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
            setSubmitError(''); // Очищаем ошибку отправки
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

            // Ошибка отправки показывается в форме (только общее сообщение)
            setSubmitError('Ошибка отправки');
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

                        <div className={styles.relatedFields}>
                            <div className={styles.rangeFieldsTitle}>Общая площадь</div>
                            
                            <ModeToggle 
                                mode={totalAreaMode} 
                                onToggle={setTotalAreaMode}
                                label="Режим указания площади:"
                                fieldName="total_area"
                            />

                            {totalAreaMode === 'exact' ? (
                                // Режим точного значения
                                <div className={styles.exactField}>
                                    <div className={styles.fieldLabel}>Площадь (м²)</div>
                                    <Form.Item
                                        name="total_area_exact"
                                        rules={[
                                            {
                                                required: totalAreaMode === 'exact',
                                                message: 'Введите площадь'
                                            },
                                            {validator: validateArea},
                                            {
                                                validator: (_, value) => {
                                                    if (value && value < 0.01) {
                                                        return Promise.reject('Общая площадь не может быть меньше 0.01 м²');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                    >
                                        <div style={{ position: 'relative', paddingTop: '50px' }}>
                                            <div style={{ 
                                                position: 'absolute', 
                                                top: '0', 
                                                right: '0',
                                                zIndex: 1
                                            }}>
                                                <InputNumber
                                                    min={1.00}
                                                    max={1000}
                                                    step={0.01}
                                                    style={{ width: '120px' }}
                                                    addonAfter="м²"
                                                    value={form.getFieldValue('total_area_exact') || 1.00}
                                                    onChange={(value) => {
                                                        if (value) {
                                                            form.setFieldsValue({ 
                                                                total_area_exact: value,
                                                                total_area_from: value,
                                                                total_area_to: value
                                                            });
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <Slider
                                                min={1.00}
                                                max={1000}
                                                step={0.01}
                                                style={{ width: '100%' }}
                                                value={form.getFieldValue('total_area_exact') || 1.00}
                                                tooltip={{
                                                    formatter: (value) => `${value} м²`,
                                                    placement: 'top'
                                                }}
                                                onChange={(value) => {
                                                    form.setFieldsValue({ 
                                                        total_area_exact: value,
                                                        total_area_from: value,
                                                        total_area_to: value
                                                    });
                                                }}
                                            />
                                        </div>
                                    </Form.Item>
                                </div>
                            ) : (
                                // Режим диапазона
                            <div className={styles.rangeFieldsContainer}>
                                <div className={styles.rangeField}>
                                        <div className={styles.fieldLabel} htmlFor="total_area_from_input">От (м²)</div>
                                    <Form.Item
                                        name="total_area_from"
                                        rules={[
                                            {
                                                required: totalAreaMode === 'range',
                                                message: 'Введите площадь'
                                            },
                                            {validator: validateArea},
                                            {
                                                validator: (_, value) => {
                                                    if (value && value < 0.01) {
                                                        return Promise.reject('Общая площадь не может быть меньше 0.01 м²');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            },
                                            {
                                                validator: (_, value) => {
                                                    const toValue = form.getFieldValue('total_area_to');
                                                    if (toValue && value && value > toValue) {
                                                        return Promise.reject('Значение "от" не может быть больше значения "до"');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                    >
                                        <div style={{ position: 'relative', paddingTop: '50px' }}>
                                            <div style={{ 
                                                position: 'absolute', 
                                                top: '0', 
                                                right: '0',
                                                zIndex: 1
                                            }}>
                                                <InputNumber
                                                    id="total_area_from_input"
                                                    min={1.00}
                                                    max={1000}
                                                    step={0.01}
                                                    style={{ width: '120px' }}
                                                    addonAfter="м²"
                                                    value={totalAreaFrom || 1.00}
                                                    onChange={(value) => {
                                                        // Убеждаемся, что значение не меньше 1.00
                                                        const validValue = value < 1.00 ? 1.00 : value;
                                                        form.setFieldsValue({ total_area_from: validValue });
                                                        
                                                        // Проверяем, что "от" не больше "до"
                                                        const toValue = form.getFieldValue('total_area_to');
                                                        if (toValue && validValue > toValue) {
                                                            form.setFieldsValue({ total_area_to: validValue });
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <Slider
                                                min={1.00}
                                                max={1000}
                                                step={0.01}
                                                style={{ width: '100%' }}
                                                value={totalAreaFrom || 1.00}
                                                tooltip={{
                                                    formatter: (value) => `${value} м²`,
                                                    placement: 'top'
                                                }}
                                                onChange={(value) => {
                                                    // Убеждаемся, что значение не меньше 1.00
                                                    const validValue = value < 1.00 ? 1.00 : value;
                                                    form.setFieldsValue({ total_area_from: validValue });
                                                    
                                                    // Проверяем, что "от" не больше "до"
                                                    const toValue = form.getFieldValue('total_area_to');
                                                    if (toValue && validValue > toValue) {
                                                        form.setFieldsValue({ total_area_to: validValue });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </Form.Item>
                                    <div className={styles.rangeFieldHint}>
                                        Укажите минимальную общую площадь помещения в квадратных метрах
                                    </div>
                                </div>

                                <div className={styles.rangeField}>
                                    <div className={styles.fieldLabel} htmlFor="total_area_to_input">До (м²)</div>
                                                                        <Form.Item
                                        name="total_area_to"
                                        rules={[
                                            {
                                                required: totalAreaMode === 'range',
                                                message: 'Введите площадь'
                                            },
                                            {validator: validateArea},
                                            {
                                                validator: (_, value) => {
                                                    if (value && value < 0.01) {
                                                        return Promise.reject('Общая площадь не может быть меньше 0.01 м²');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            },
                                            {
                                                validator: (_, value) => {
                                                    const fromValue = form.getFieldValue('total_area_from');
                                                    if (fromValue && value && value < fromValue) {
                                                        return Promise.reject('Значение "до" не может быть меньше значения "от"');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                    >
                                        <div style={{ position: 'relative', paddingTop: '50px' }}>
                                            <div style={{ 
                                                position: 'absolute', 
                                                top: '0', 
                                                right: '0',
                                                zIndex: 1
                                            }}>
                                                <InputNumber
                                                    id="total_area_to_input"
                                                    min={1.00}
                                                    max={1000}
                                                    step={0.01}
                                                    style={{ width: '120px' }}
                                                    addonAfter="м²"
                                                    value={totalAreaTo || 1.00}
                                                    onChange={(value) => {
                                                        // Убеждаемся, что значение не меньше 1.00
                                                        const validValue = value < 1.00 ? 1.00 : value;
                                                        form.setFieldsValue({ total_area_to: validValue });
                                                        
                                                        // Проверяем, что "до" не меньше "от"
                                                        const fromValue = form.getFieldValue('total_area_from');
                                                        if (fromValue && validValue < fromValue) {
                                                            form.setFieldsValue({ total_area_from: validValue });
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <Slider
                                                min={1.00}
                                                max={1000}
                                                step={0.01}
                                                style={{ width: '100%' }}
                                                value={totalAreaTo || 1.00}
                                                tooltip={{
                                                    formatter: (value) => `${value} м²`,
                                                    placement: 'top'
                                                }}
                                                onChange={(value) => {
                                                    // Убеждаемся, что значение не меньше 1.00
                                                    const validValue = value < 1.00 ? 1.00 : value;
                                                    form.setFieldsValue({ total_area_to: validValue });
                                                    
                                                    // Проверяем, что "до" не меньше "от"
                                                    const fromValue = form.getFieldValue('total_area_from');
                                                    if (fromValue && validValue < fromValue) {
                                                        form.setFieldsValue({ total_area_from: validValue });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </Form.Item>
                                    <div className={styles.rangeFieldHint}>
                                        Укажите максимальную общую площадь. Если точная площадь известна, оставьте то же значение
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>

                        {showFloorFields() && (
                            <>
                                <div className={styles.relatedFields}>
                                    <div className={styles.rangeFieldsTitle}>Этаж квартиры</div>
                                    
                                    <ModeToggle 
                                        mode={floorMode} 
                                        onToggle={setFloorMode}
                                        label="Режим указания этажа:"
                                        fieldName="floor"
                                    />

                                    {floorMode === 'exact' ? (
                                        // Режим точного значения
                                        <div className={styles.exactField}>
                                            <div className={styles.fieldLabel}>Этаж</div>
                                            <Form.Item
                                                name="floor_exact"
                                                rules={[
                                                    {
                                                        required: !['house', 'townhouse'].includes(propertyType) && floorMode === 'exact',
                                                        message: 'Введите этаж'
                                                    },
                                                    {validator: validateFloor},
                                                    {
                                                        validator: (_, value) => {
                                                            if (value && value < 1) {
                                                                return Promise.reject('Этаж квартиры не может быть меньше 1');
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    }
                                                ]}
                                            >
                                                <div style={{ position: 'relative', paddingTop: '50px' }}>
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        top: '0', 
                                                        right: '0',
                                                        zIndex: 1
                                                    }}>
                                                        <InputNumber
                                                            min={1}
                                                            max={100}
                                                            step={1}
                                                            style={{ width: '120px' }}
                                                            addonAfter="этаж"
                                                            value={form.getFieldValue('floor_exact') || 1}
                                                            onChange={(value) => {
                                                                if (value) {
                                                                    form.setFieldsValue({ 
                                                                        floor_exact: value,
                                                                        floor_from: value,
                                                                        floor_to: value
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <Slider
                                                        min={1}
                                                        max={100}
                                                        step={1}
                                                        style={{ width: '100%' }}
                                                        value={form.getFieldValue('floor_exact') || 1}
                                                        tooltip={{
                                                            formatter: (value) => `${value} этаж`,
                                                            placement: 'top'
                                                        }}
                                                        onChange={(value) => {
                                                            form.setFieldsValue({ 
                                                                floor_exact: value,
                                                                floor_from: value,
                                                                floor_to: value
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </Form.Item>
                                        </div>
                                    ) : (
                                        // Режим диапазона
                                    <div className={styles.rangeFieldsContainer}>
                                        <div className={styles.rangeField}>
                                    <div className={styles.fieldLabel} htmlFor="floor_from_input">От</div>
                                            <Form.Item
                                                name="floor_from"
                                                rules={[
                                                    {
                                                        required: !['house', 'townhouse'].includes(propertyType) && floorMode === 'range',
                                                        message: 'Введите этаж'
                                                    },
                                                    {validator: validateFloor},
                                                    {
                                                        validator: (_, value) => {
                                                            if (value && value < 1) {
                                                                return Promise.reject('Этаж квартиры не может быть меньше 1');
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    },
                                                    {
                                                        validator: (_, value) => {
                                                            const toValue = form.getFieldValue('floor_to');
                                                            if (toValue && value && value > toValue) {
                                                                return Promise.reject('Этаж "от" не может быть больше этажа "до"');
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    }
                                                ]}
                                            >
                                                <div style={{ position: 'relative', paddingTop: '50px' }}>
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        top: '0', 
                                                        right: '0',
                                                        zIndex: 1
                                                    }}>
                                                        <InputNumber
                                                            id="floor_from_input"
                                                            min={1}
                                                            max={100}
                                                            step={1}
                                                            style={{ width: '120px' }}
                                                            addonAfter="этаж"
                                                            value={floorFrom || 1}
                                                            onChange={(value) => {
                                                                form.setFieldsValue({ floor_from: value });
                                                            }}
                                                        />
                                                    </div>
                                                    <Slider
                                                        min={1}
                                                        max={100}
                                                        step={1}
                                                        style={{ width: '100%' }}
                                                        value={floorFrom || 1}
                                                        tooltip={{
                                                            formatter: (value) => `${value} этаж`,
                                                            placement: 'top'
                                                        }}
                                                        onChange={(value) => {
                                                            form.setFieldsValue({ floor_from: value });
                                                        }}
                                                    />
                                                </div>
                                            </Form.Item>
                                            <div className={styles.rangeFieldHint}>
                                                Если вы не знаете точный этаж, укажите диапазон. Минимальный этаж - 1
                                            </div>
                                        </div>

                                        <div className={styles.rangeField}>
                                            <div className={styles.fieldLabel} htmlFor="floor_to_input">До</div>
                                            <Form.Item
                                                name="floor_to"
                                                rules={[
                                                    {
                                                        required: !['house', 'townhouse'].includes(propertyType) && floorMode === 'range',
                                                        message: 'Введите этаж'
                                                    },
                                                    {validator: validateFloor},
                                                    {
                                                        validator: (_, value) => {
                                                            const fromValue = form.getFieldValue('floor_from');
                                                            if (fromValue && value && value < fromValue) {
                                                                return Promise.reject('Этаж "до" не может быть меньше этажа "от"');
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    },
                                                    {
                                                        validator: (_, value) => {
                                                            const totalFloorsTo = form.getFieldValue('total_floors_to');
                                                            if (totalFloorsTo && value && value > totalFloorsTo) {
                                                                return Promise.reject('Этаж квартиры не может быть больше этажности дома');
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    }
                                                ]}
                                            >
                                                <div style={{ position: 'relative', paddingTop: '50px' }}>
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        top: '0', 
                                                        right: '0',
                                                        zIndex: 1
                                                    }}>
                                                        <InputNumber
                                                            id="floor_to_input"
                                                            min={1}
                                                            max={100}
                                                            step={1}
                                                            style={{ width: '120px' }}
                                                            addonAfter="этаж"
                                                            value={floorTo || 1}
                                                            onChange={(value) => {
                                                                form.setFieldsValue({ floor_to: value });
                                                            }}
                                                        />
                                                    </div>
                                                    <Slider
                                                        min={1}
                                                        max={100}
                                                        step={1}
                                                        style={{ width: '100%' }}
                                                        value={floorTo || 1}
                                                        tooltip={{
                                                            formatter: (value) => `${value} этаж`,
                                                            placement: 'top'
                                                        }}
                                                        onChange={(value) => {
                                                            form.setFieldsValue({ floor_to: value });
                                                        }}
                                                    />
                                                </div>
                                            </Form.Item>
                                            <div className={styles.rangeFieldHint}>
                                                Максимальный этаж не может быть больше этажности дома
                                            </div>
                                        </div>
                                    </div>
                                )}
                                </div>

                                <div className={styles.relatedFields}>
                                    <div className={styles.rangeFieldsTitle}>Этажность дома</div>
                                    
                                    <ModeToggle 
                                        mode={totalFloorsMode} 
                                        onToggle={setTotalFloorsMode}
                                        label="Режим указания этажности:"
                                        fieldName="total_floors"
                                    />

                                    {totalFloorsMode === 'exact' ? (
                                        // Режим точного значения
                                        <div className={styles.exactField}>
                                            <div className={styles.fieldLabel}>Этажность дома</div>
                                            <Form.Item
                                                name="total_floors_exact"
                                                rules={[
                                                    {
                                                        required: totalFloorsMode === 'exact',
                                                        message: 'Введите этажность дома'
                                                    },
                                                    {validator: validateFloor},
                                                    {
                                                        validator: (_, value) => {
                                                            if (value && value < 1) {
                                                                return Promise.reject('Этажность дома не может быть меньше 1');
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    }
                                                ]}
                                            >
                                                <div style={{ position: 'relative', paddingTop: '50px' }}>
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        top: '0', 
                                                        right: '0',
                                                        zIndex: 1
                                                    }}>
                                                        <InputNumber
                                                            min={1}
                                                            max={200}
                                                            step={1}
                                                            style={{ width: '120px' }}
                                                            addonAfter="этажей"
                                                            value={form.getFieldValue('total_floors_exact') || 1}
                                                            onChange={(value) => {
                                                                if (value) {
                                                                    form.setFieldsValue({ 
                                                                        total_floors_exact: value,
                                                                        total_floors_from: value,
                                                                        total_floors_to: value
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <Slider
                                                        min={1}
                                                        max={200}
                                                        step={1}
                                                        style={{ width: '100%' }}
                                                        value={form.getFieldValue('total_floors_exact') || 1}
                                                        tooltip={{
                                                            formatter: (value) => `${value} этажей`,
                                                            placement: 'top'
                                                        }}
                                                        onChange={(value) => {
                                                            form.setFieldsValue({ 
                                                                total_floors_exact: value,
                                                                total_floors_from: value,
                                                                total_floors_to: value
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </Form.Item>
                                        </div>
                                    ) : (
                                        // Режим диапазона
                                    <div className={styles.rangeFieldsContainer}>
                                        <div className={styles.rangeField}>
                                    <div className={styles.fieldLabel} htmlFor="total_floors_from_input">От</div>
                                            <Form.Item
                                                name="total_floors_from"
                                                rules={[
                                                    {
                                                        required: totalFloorsMode === 'range',
                                                        message: 'Введите этажность дома'
                                                    },
                                                    {validator: validateFloor},
                                                    {
                                                        validator: (_, value) => {
                                                            const toValue = form.getFieldValue('total_floors_to');
                                                            if (toValue && value && value > toValue) {
                                                                return Promise.reject('Этажность "от" не может быть больше этажности "до"');
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    }
                                                ]}
                                            >
                                                <div style={{ position: 'relative', paddingTop: '50px' }}>
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        top: '0', 
                                                        right: '0',
                                                        zIndex: 1
                                                    }}>
                                                        <InputNumber
                                                            id="total_floors_from_input"
                                                            min={1}
                                                            max={200}
                                                            step={1}
                                                            style={{ width: '120px' }}
                                                            addonAfter="этажей"
                                                            value={totalFloorsFrom || 1}
                                                            onChange={(value) => {
                                                                form.setFieldsValue({ total_floors_from: value });
                                                            }}
                                                        />
                                                    </div>
                                                    <Slider
                                                        min={1}
                                                        max={200}
                                                        step={1}
                                                        style={{ width: '100%' }}
                                                        value={totalFloorsFrom || 1}
                                                        tooltip={{
                                                            formatter: (value) => `${value} этажей`,
                                                            placement: 'top'
                                                        }}
                                                        onChange={(value) => {
                                                            form.setFieldsValue({ total_floors_from: value });
                                                        }}
                                                    />
                                                </div>
                                            </Form.Item>
                                            <div className={styles.rangeFieldHint}>
                                                Если вы не знаете точную этажность дома, укажите примерный диапазон
                                            </div>
                                        </div>

                                        <div className={styles.rangeField}>
                                            <div className={styles.fieldLabel} htmlFor="total_floors_to_input">До</div>
                                            <Form.Item
                                                name="total_floors_to"
                                                rules={[
                                                    {
                                                        required: totalFloorsMode === 'range',
                                                        message: 'Введите этажность дома'
                                                    },
                                                    {validator: validateFloor},
                                                    {
                                                        validator: (_, value) => {
                                                            const fromValue = form.getFieldValue('total_floors_from');
                                                            if (fromValue && value && value < fromValue) {
                                                                return Promise.reject('Этажность "до" не может быть меньше этажности "от"');
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    }
                                                ]}
                                            >
                                                <div style={{ position: 'relative', paddingTop: '50px' }}>
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        top: '0', 
                                                        right: '0',
                                                        zIndex: 1
                                                    }}>
                                                        <InputNumber
                                                            id="total_floors_to_input"
                                                            min={1}
                                                            max={200}
                                                            step={1}
                                                            style={{ width: '120px' }}
                                                            addonAfter="этажей"
                                                            value={totalFloorsTo || 1}
                                                            onChange={(value) => {
                                                                form.setFieldsValue({ total_floors_to: value });
                                                            }}
                                                        />
                                                    </div>
                                                    <Slider
                                                        min={1}
                                                        max={200}
                                                        step={1}
                                                        style={{ width: '100%' }}
                                                        value={totalFloorsTo || 1}
                                                        tooltip={{
                                                            formatter: (value) => `${value} этажей`,
                                                            placement: 'top'
                                                        }}
                                                        onChange={(value) => {
                                                            form.setFieldsValue({ total_floors_to: value });
                                                        }}
                                                    />
                                                </div>
                                            </Form.Item>
                                            <div className={styles.rangeFieldHint}>
                                                Если вы не знаете точную этажность дома, укажите примерный диапазон
                                            </div>
                                        </div>
                                    </div>
                                )}
                                </div>
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
                                {
                                    required: propertyType !== 'studio',
                                    message: propertyType === 'studio' ? 'Для студии количество комнат не требуется' : 'Введите количество комнат'
                                }
                            ]}
                        >
                            <div style={{ position: 'relative', paddingTop: '50px' }}>
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '0', 
                                    right: '0',
                                    zIndex: 1
                                }}>
                                    <InputNumber
                                        id="rooms_input"
                                        min={propertyType === 'studio' ? 0 : 1}
                                        max={20}
                                        step={1}
                                        style={{ width: '120px' }}
                                        addonAfter="комн."
                                        value={rooms || (propertyType === 'studio' ? 0 : 1)}
                                        onChange={(value) => {
                                            form.setFieldsValue({ rooms: value });
                                        }}
                                    />
                                </div>
                                <Slider
                                    min={propertyType === 'studio' ? 0 : 1}
                                    max={20}
                                    step={1}
                                    style={{ width: '100%' }}
                                    value={rooms || (propertyType === 'studio' ? 0 : 1)}
                                    tooltip={{
                                        formatter: (value) => value === 0 ? 'Студия' : `${value} комн.`,
                                        placement: 'top'
                                    }}
                                    onChange={(value) => {
                                        form.setFieldsValue({ rooms: value });
                                    }}
                                />
                            </div>
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

                        <div className={styles.relatedFields}>
                            <div className={styles.rangeFieldsTitle}>Жилая площадь</div>
                            
                            <ModeToggle 
                                mode={livingAreaMode} 
                                onToggle={setLivingAreaMode}
                                label="Режим указания жилой площади:"
                                fieldName="living_area"
                            />

                            {livingAreaMode === 'exact' ? (
                                // Режим точного значения
                                <div className={styles.exactField}>
                                    <div className={styles.fieldLabel}>Жилая площадь (м²)</div>
                                    <Form.Item
                                        name="living_area_exact"
                                        rules={[
                                            {
                                                required: livingAreaMode === 'exact',
                                                message: 'Введите жилую площадь'
                                            },
                                            {validator: validateArea},
                                            {
                                                validator: (_, value) => {
                                                    if (value && value < 0.01) {
                                                        return Promise.reject('Жилая площадь не может быть меньше 0.01 м²');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                    >
                                        <div style={{ position: 'relative', paddingTop: '50px' }}>
                                            <div style={{ 
                                                position: 'absolute', 
                                                top: '0', 
                                                right: '0',
                                                zIndex: 1
                                            }}>
                                                <InputNumber
                                                    min={1.00}
                                                    max={1000}
                                                    step={0.01}
                                                    style={{ width: '120px' }}
                                                    addonAfter="м²"
                                                    value={form.getFieldValue('living_area_exact') || 1.00}
                                                    onChange={(value) => {
                                                        if (value) {
                                                            form.setFieldsValue({ 
                                                                living_area_exact: value,
                                                                living_area_from: value,
                                                                living_area_to: value
                                                            });
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <Slider
                                                min={1.00}
                                                max={1000}
                                                step={0.01}
                                                style={{ width: '100%' }}
                                                value={form.getFieldValue('living_area_exact') || 1.00}
                                                tooltip={{
                                                    formatter: (value) => `${value} м²`,
                                                    placement: 'top'
                                                }}
                                                onChange={(value) => {
                                                    form.setFieldsValue({ 
                                                        living_area_exact: value,
                                                        living_area_from: value,
                                                        living_area_to: value
                                                    });
                                                }}
                                            />
                                        </div>
                                    </Form.Item>
                                </div>
                            ) : (
                                // Режим диапазона
                            <div className={styles.rangeFieldsContainer}>
                                <div className={styles.rangeField}>
                                        <div className={styles.fieldLabel} htmlFor="living_area_from_input">От (м²)</div>
                                    <Form.Item
                                        name="living_area_from"
                                        rules={[
                                            {
                                                required: livingAreaMode === 'range',
                                                message: 'Введите жилую площадь'
                                            },
                                            {validator: validateArea},
                                            {
                                                validator: (_, value) => {
                                                    if (value && value < 0.01) {
                                                        return Promise.reject('Жилая площадь не может быть меньше 0.01 м²');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            },
                                            {
                                                validator: (_, value) => {
                                                    const toValue = form.getFieldValue('living_area_to');
                                                    if (toValue && value && value > toValue) {
                                                        return Promise.reject('Значение "от" не может быть больше значения "до"');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                    >
                                        <div style={{ position: 'relative', paddingTop: '50px' }}>
                                            <div style={{ 
                                                position: 'absolute', 
                                                top: '0', 
                                                right: '0',
                                                zIndex: 1
                                            }}>
                                                <InputNumber
                                                    id="living_area_from_input"
                                                    min={1.00}
                                                    max={800}
                                                    step={0.01}
                                                    style={{ width: '120px' }}
                                                    addonAfter="м²"
                                                    value={livingAreaFrom || 1.00}
                                                    onChange={(value) => {
                                                        // Убеждаемся, что значение не меньше 1.00
                                                        const validValue = value < 1.00 ? 1.00 : value;
                                                        form.setFieldsValue({ living_area_from: validValue });
                                                    }}
                                                />
                                            </div>
                                            <Slider
                                                min={1.00}
                                                max={800}
                                                step={0.01}
                                                style={{ width: '100%' }}
                                                value={livingAreaFrom || 1.00}
                                                tooltip={{
                                                    formatter: (value) => `${value} м²`,
                                                    placement: 'top'
                                                }}
                                                onChange={(value) => {
                                                    // Убеждаемся, что значение не меньше 1.00
                                                    const validValue = value < 1.00 ? 1.00 : value;
                                                    form.setFieldsValue({ living_area_from: validValue });
                                                }}
                                            />
                                        </div>
                                    </Form.Item>
                                    <div className={styles.rangeFieldHint}>
                                        Укажите минимальную жилую площадь помещения
                                    </div>
                                </div>

                                <div className={styles.rangeField}>
                                    <div className={styles.fieldLabel} htmlFor="living_area_to_input">До (м²)</div>
                                    <Form.Item
                                        name="living_area_to"
                                        rules={[
                                            {
                                                required: livingAreaMode === 'range',
                                                message: 'Введите жилую площадь'
                                            },
                                            {validator: validateArea},
                                            {
                                                validator: (_, value) => {
                                                    if (value && value < 0.01) {
                                                        return Promise.reject('Жилая площадь не может быть меньше 0.01 м²');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            },
                                            {
                                                validator: (_, value) => {
                                                    const fromValue = form.getFieldValue('living_area_from');
                                                    if (fromValue && value && value < fromValue) {
                                                        return Promise.reject('Значение "до" не может быть меньше значения "от"');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                    >
                                        <div style={{ position: 'relative', paddingTop: '50px' }}>
                                            <div style={{ 
                                                position: 'absolute', 
                                                top: '0', 
                                                right: '0',
                                                zIndex: 1
                                            }}>
                                                <InputNumber
                                                    id="living_area_to_input"
                                                    min={1.00}
                                                    max={800}
                                                    step={0.01}
                                                    style={{ width: '120px' }}
                                                    addonAfter="м²"
                                                    value={livingAreaTo || 1.00}
                                                    onChange={(value) => {
                                                        // Убеждаемся, что значение не меньше 1.00
                                                        const validValue = value < 1.00 ? 1.00 : value;
                                                        form.setFieldsValue({ living_area_to: validValue });
                                                    }}
                                                />
                                            </div>
                                            <Slider
                                                min={1.00}
                                                max={800}
                                                step={0.01}
                                                style={{ width: '100%' }}
                                                value={livingAreaTo || 1.00}
                                                tooltip={{
                                                    formatter: (value) => `${value} м²`,
                                                    placement: 'top'
                                                }}
                                                onChange={(value) => {
                                                    // Убеждаемся, что значение не меньше 1.00
                                                    const validValue = value < 1.00 ? 1.00 : value;
                                                    form.setFieldsValue({ living_area_to: validValue });
                                                }}
                                            />
                                        </div>
                                    </Form.Item>
                                    <div className={styles.rangeFieldHint}>
                                        Укажите максимальную жилую площадь. Если точная площадь известна, оставьте то же значение
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>

                        <div className={styles.relatedFields}>
                            <div className={styles.rangeFieldsTitle}>Площадь кухни</div>
                            
                            <ModeToggle 
                                mode={kitchenAreaMode} 
                                onToggle={setKitchenAreaMode}
                                label="Режим указания площади кухни:"
                                fieldName="kitchen_area"
                            />

                            {kitchenAreaMode === 'exact' ? (
                                // Режим точного значения
                                <div className={styles.exactField}>
                                    <div className={styles.fieldLabel}>Площадь кухни (м²)</div>
                                    <Form.Item
                                        name="kitchen_area_exact"
                                        rules={[
                                            {
                                                required: kitchenAreaMode === 'exact',
                                                message: 'Введите площадь кухни'
                                            },
                                            {validator: validateArea},
                                            {
                                                validator: (_, value) => {
                                                    if (value && value < 0.01) {
                                                        return Promise.reject('Площадь кухни не может быть меньше 0.01 м²');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                    >
                                        <div style={{ position: 'relative', paddingTop: '50px' }}>
                                            <div style={{ 
                                                position: 'absolute', 
                                                top: '0', 
                                                right: '0',
                                                zIndex: 1
                                            }}>
                                                <InputNumber
                                                    min={1.00}
                                                    max={200}
                                                    step={0.01}
                                                    style={{ width: '120px' }}
                                                    addonAfter="м²"
                                                    value={form.getFieldValue('kitchen_area_exact') || 1.00}
                                                    onChange={(value) => {
                                                        if (value) {
                                                            form.setFieldsValue({ 
                                                                kitchen_area_exact: value,
                                                                kitchen_area_from: value,
                                                                kitchen_area_to: value
                                                            });
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <Slider
                                                min={1.00}
                                                max={200}
                                                step={0.01}
                                                style={{ width: '100%' }}
                                                value={form.getFieldValue('kitchen_area_exact') || 1.00}
                                                tooltip={{
                                                    formatter: (value) => `${value} м²`,
                                                    placement: 'top'
                                                }}
                                                onChange={(value) => {
                                                    form.setFieldsValue({ 
                                                        kitchen_area_exact: value,
                                                        kitchen_area_from: value,
                                                        kitchen_area_to: value
                                                    });
                                                }}
                                            />
                                        </div>
                                    </Form.Item>
                                </div>
                            ) : (
                                // Режим диапазона
                            <div className={styles.rangeFieldsContainer}>
                                <div className={styles.rangeField}>
                                        <div className={styles.fieldLabel} htmlFor="kitchen_area_from_input">От (м²)</div>
                                    <Form.Item
                                        name="kitchen_area_from"
                                        rules={[
                                            {
                                                required: kitchenAreaMode === 'range',
                                                message: 'Введите площадь кухни'
                                            },
                                            {validator: validateArea},
                                            {
                                                validator: (_, value) => {
                                                    if (value && value < 0.01) {
                                                        return Promise.reject('Площадь кухни не может быть меньше 0.01 м²');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            },
                                            {
                                                validator: (_, value) => {
                                                    const toValue = form.getFieldValue('kitchen_area_to');
                                                    if (toValue && value && value > toValue) {
                                                        return Promise.reject('Значение "от" не может быть больше значения "до"');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                    >
                                        <div style={{ position: 'relative', paddingTop: '50px' }}>
                                            <div style={{ 
                                                position: 'absolute', 
                                                top: '0', 
                                                right: '0',
                                                zIndex: 1
                                            }}>
                                                <InputNumber
                                                    id="kitchen_area_from_input"
                                                    min={1.00}
                                                    max={200}
                                                    step={0.01}
                                                    style={{ width: '120px' }}
                                                    addonAfter="м²"
                                                    value={kitchenAreaFrom || 1.00}
                                                    onChange={(value) => {
                                                        // Убеждаемся, что значение не меньше 1.00
                                                        const validValue = value < 1.00 ? 1.00 : value;
                                                        form.setFieldsValue({ kitchen_area_from: validValue });
                                                    }}
                                                />
                                            </div>
                                                                                         <Slider
                                                 min={1.00}
                                                 max={200}
                                                 step={0.01}
                                                 style={{ width: '100%' }}
                                                 value={kitchenAreaFrom || 1.00}
                                                 tooltip={{
                                                     formatter: (value) => `${value} м²`,
                                                     placement: 'top'
                                                 }}
                                                 onChange={(value) => {
                                                     // Убеждаемся, что значение не меньше 1.00
                                                     const validValue = value < 1.00 ? 1.00 : value;
                                                     form.setFieldsValue({ kitchen_area_from: validValue });
                                                 }}
                                             />
                                        </div>
                                    </Form.Item>
                                    <div className={styles.rangeFieldHint}>
                                        Укажите минимальную площадь кухни
                                    </div>
                                </div>

                                <div className={styles.rangeField}>
                                    <div className={styles.fieldLabel} htmlFor="kitchen_area_to_input">До (м²)</div>
                                    <Form.Item
                                        name="kitchen_area_to"
                                        rules={[
                                            {
                                                required: kitchenAreaMode === 'range',
                                                message: 'Введите площадь кухни'
                                            },
                                            {validator: validateArea},
                                            {
                                                validator: (_, value) => {
                                                    if (value && value < 0.01) {
                                                        return Promise.reject('Площадь кухни не может быть меньше 0.01 м²');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            },
                                            {
                                                validator: (_, value) => {
                                                    const fromValue = form.getFieldValue('kitchen_area_from');
                                                    if (fromValue && value && value < fromValue) {
                                                        return Promise.reject('Значение "до" не может быть меньше значения "от"');
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                    >
                                        <div style={{ position: 'relative', paddingTop: '50px' }}>
                                            <div style={{ 
                                                position: 'absolute', 
                                                top: '0', 
                                                right: '0',
                                                zIndex: 1
                                            }}>
                                                <InputNumber
                                                    id="kitchen_area_to_input"
                                                    min={1.00}
                                                    max={200}
                                                    step={0.01}
                                                    style={{ width: '120px' }}
                                                    addonAfter="м²"
                                                    value={kitchenAreaTo || 1.00}
                                                    onChange={(value) => {
                                                        // Убеждаемся, что значение не меньше 1.00
                                                        const validValue = value < 1.00 ? 1.00 : value;
                                                        form.setFieldsValue({ kitchen_area_to: validValue });
                                                    }}
                                                />
                                            </div>
                                                                                         <Slider
                                                 min={1.00}
                                                 max={200}
                                                 step={0.01}
                                                 style={{ width: '100%' }}
                                                 value={kitchenAreaTo || 1.00}
                                                 tooltip={{
                                                     formatter: (value) => `${value} м²`,
                                                     placement: 'top'
                                                 }}
                                                 onChange={(value) => {
                                                     // Убеждаемся, что значение не меньше 1.00
                                                     const validValue = value < 1.00 ? 1.00 : value;
                                                     form.setFieldsValue({ kitchen_area_to: validValue });
                                                 }}
                                             />
                                        </div>
                                    </Form.Item>
                                    <div className={styles.rangeFieldHint}>
                                        Укажите максимальную площадь кухни. Если точная площадь известна, оставьте то же значение
                                                    </div>
                                                </div>
                                            </div>
                        )}
                                        </div>
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
                                onChange={({fileList}) => {
                                    setFileList(fileList);
                                    // Очищаем ошибки при успешной загрузке
                                    setUploadErrors({});
                                }}
                                beforeUpload={(file) => {
                                    // Проверка размера файла (10MB)
                                    const isLt10M = file.size / 1024 / 1024 < 10;
                                    if (!isLt10M) {
                                        setUploadErrors(prev => ({
                                            ...prev,
                                            size: 'Изображение должно быть меньше 10MB'
                                        }));
                                        return false;
                                    }

                                    // Проверка типа файла
                                    const isImage = file.type.startsWith('image/');
                                    if (!isImage) {
                                        setUploadErrors(prev => ({
                                            ...prev,
                                            type: 'Можно загружать только изображения'
                                        }));
                                        return false;
                                    }

                                    // Проверка общего размера всех файлов (50MB)
                                    const totalSize = fileList.reduce((sum, f) => sum + (f.size || 0), 0) + file.size;
                                    const isTotalSizeOk = totalSize / 1024 / 1024 < 50;
                                    if (!isTotalSizeOk) {
                                        setUploadErrors(prev => ({
                                            ...prev,
                                            totalSize: 'Общий размер всех файлов не должен превышать 50MB'
                                        }));
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
                            {/* Отображение ошибок загрузки */}
                            {Object.keys(uploadErrors).length > 0 && (
                                <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '8px' }}>
                                    {Object.values(uploadErrors).map((error, index) => (
                                        <div key={index}>{error}</div>
                                    ))}
                                </div>
                            )}
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
                    bargain: false,
                    total_area_exact: 1.00,
                    total_area_from: 1.00,
                    total_area_to: 1.00,
                    floor_exact: 1,
                    floor_from: 1,
                    floor_to: 1,
                    total_floors_exact: 1,
                    total_floors_from: 1,
                    total_floors_to: 1,
                    living_area_exact: 1.00,
                    living_area_from: 1.00,
                    living_area_to: 1.00,
                    kitchen_area_exact: 1.00,
                    kitchen_area_from: 1.00,
                    kitchen_area_to: 1.00
                }}
                onFinish={currentStep === steps.length - 1 ? handleSubmit : nextStep}
            >
                <div
                    className={styles.formContent}
                    ref={formContentRef}
                >
                    {renderFormStep()}
                    
                    {/* Отображение ошибки отправки */}
                    {submitError && (
                        <div style={{ color: '#ff4d4f', fontSize: '14px', textAlign: 'center', padding: '16px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: '6px', marginBottom: '16px' }}>
                            {submitError}
                        </div>
                    )}
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