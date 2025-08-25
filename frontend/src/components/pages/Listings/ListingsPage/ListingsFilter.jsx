import React, { useState, useEffect } from 'react';
import { Button, Slider, InputNumber, Collapse, Space, Divider } from 'antd';
import { FilterOutlined, ClearOutlined, DownOutlined } from '@ant-design/icons';
import styles from './ListingsFilter.module.css';

const ListingsFilter = ({ onFilterChange, onClearFilters, totalCount, filteredCount, activeFilters }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [filters, setFilters] = useState({
        totalAreaFrom: 1,
        totalAreaTo: 1000,
        livingAreaFrom: 1,
        livingAreaTo: 500,
        floorFrom: 1,
        floorTo: 50,
        totalFloorsFrom: 1,
        totalFloorsTo: 100,
    });

    const [sliderValues, setSliderValues] = useState({
        totalArea: [1, 1000],
        livingArea: [1, 500],
        floor: [1, 50],
        totalFloors: [1, 100],
    });

    const handleSliderChange = (type, values) => {
        setSliderValues(prev => ({ ...prev, [type]: values }));
        
        const [from, to] = values;
        if (type === 'totalArea') {
            setFilters(prev => ({ ...prev, totalAreaFrom: from, totalAreaTo: to }));
        } else if (type === 'livingArea') {
            setFilters(prev => ({ ...prev, livingAreaFrom: from, livingAreaTo: to }));
        } else if (type === 'floor') {
            setFilters(prev => ({ ...prev, floorFrom: from, floorTo: to }));
        } else if (type === 'totalFloors') {
            setFilters(prev => ({ ...prev, totalFloorsFrom: from, totalFloorsTo: to }));
        }
    };

    const handleInputChange = (type, field, value) => {
        if (type === 'totalArea') {
            setFilters(prev => ({ ...prev, [field]: value }));
            if (field === 'totalAreaFrom') {
                setSliderValues(prev => ({ ...prev, totalArea: [value, prev.totalArea[1]] }));
            } else {
                setSliderValues(prev => ({ ...prev, totalArea: [prev.totalArea[0], value] }));
            }
        } else if (type === 'livingArea') {
            setFilters(prev => ({ ...prev, [field]: value }));
            if (field === 'livingAreaFrom') {
                setSliderValues(prev => ({ ...prev, livingArea: [value, prev.livingArea[1]] }));
            } else {
                setSliderValues(prev => ({ ...prev, livingArea: [prev.livingArea[0], value] }));
            }
        } else if (type === 'floor') {
            setFilters(prev => ({ ...prev, [field]: value }));
            if (field === 'floorFrom') {
                setSliderValues(prev => ({ ...prev, floor: [value, prev.floor[1]] }));
            } else {
                setSliderValues(prev => ({ ...prev, floor: [prev.floor[0], value] }));
            }
        } else if (type === 'totalFloors') {
            setFilters(prev => ({ ...prev, [field]: value }));
            if (field === 'totalFloorsFrom') {
                setSliderValues(prev => ({ ...prev, totalFloors: [value, prev.totalFloors[1]] }));
            } else {
                setSliderValues(prev => ({ ...prev, totalFloors: [prev.totalFloors[0], value] }));
            }
        }
    };

    const applyFilters = () => {
        // Всегда передаем все фильтры, так как у нас есть значения по умолчанию
        onFilterChange(filters);
    };

    const clearFilters = () => {
        setFilters({
            totalAreaFrom: 1,
            totalAreaTo: 1000,
            livingAreaFrom: 1,
            livingAreaTo: 500,
            floorFrom: 1,
            floorTo: 50,
            totalFloorsFrom: 1,
            totalFloorsTo: 100,
        });
        
        setSliderValues({
            totalArea: [1, 1000],
            livingArea: [1, 500],
            floor: [1, 50],
            totalFloors: [1, 100],
        });
        
        onClearFilters();
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== null && value !== undefined);

    // Автоматически применяем фильтры по умолчанию при загрузке
    useEffect(() => {
        onFilterChange(filters);
    }, []); // Пустой массив зависимостей - выполняется только при монтировании

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`${styles.filterContainer} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={`${styles.filterHeader} ${isCollapsed ? styles.collapsed : ''}`}>
                <div className={styles.filterTitle}>
                    <FilterOutlined className={styles.filterIcon} />
                    <div>
                        <h3>Фильтры</h3>
                        <div className={styles.resultsCount}>
                            {filteredCount === totalCount ? (
                                `Показано ${totalCount} квартир`
                            ) : (
                                `Показано ${filteredCount} из ${totalCount} квартир`
                            )}
                        </div>
                    </div>
                </div>
                <button 
                    className={`${styles.collapseButton} ${isCollapsed ? styles.collapsed : ''}`}
                    onClick={toggleCollapse}
                    title={isCollapsed ? 'Развернуть фильтры' : 'Свернуть фильтры'}
                >
                    <span>{isCollapsed ? 'Развернуть' : 'Свернуть'}</span>
                    <DownOutlined className={styles.icon} />
                </button>
            </div>

            <div className={styles.filterContent}>
                <Collapse 
                    defaultActiveKey={['1']} 
                    ghost 
                    className={styles.filterCollapse}
                    items={[
                    {
                        key: '1',
                        label: 'Общая площадь',
                        children: (
                            <div className={styles.filterSection}>
                                <div className={styles.rangeInputs}>
                                    <Space>
                                        <div className={styles.inputGroup}>
                                            <InputNumber
                                                min={1}
                                                max={1000}
                                                value={filters.totalAreaFrom || 1}
                                                onChange={(value) => handleInputChange('totalArea', 'totalAreaFrom', value)}
                                                placeholder="1"
                                                style={{ width: 80 }}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <InputNumber
                                                min={1}
                                                max={1000}
                                                value={filters.totalAreaTo || 1000}
                                                onChange={(value) => handleInputChange('totalArea', 'totalAreaTo', value)}
                                                placeholder="1000"
                                                style={{ width: 80 }}
                                            />
                                        </div>
                                    </Space>
                                </div>
                                <Slider
                                    range
                                    min={1}
                                    max={1000}
                                    value={sliderValues.totalArea}
                                    onChange={(values) => handleSliderChange('totalArea', values)}
                                    tooltip={{
                                        formatter: (value) => `${value} м²`,
                                        placement: 'top'
                                    }}
                                    className={styles.rangeSlider}
                                />
                            </div>
                        )
                    },
                    {
                        key: '2',
                        label: 'Жилая площадь',
                        children: (
                            <div className={styles.filterSection}>
                                <div className={styles.rangeInputs}>
                                    <Space>
                                        <div className={styles.inputGroup}>
                                            <InputNumber
                                                min={1}
                                                max={500}
                                                value={filters.livingAreaFrom || 1}
                                                onChange={(value) => handleInputChange('livingArea', 'livingAreaFrom', value)}
                                                placeholder="1"
                                                style={{ width: 80 }}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <InputNumber
                                                min={1}
                                                max={500}
                                                value={filters.livingAreaTo || 500}
                                                onChange={(value) => handleInputChange('livingArea', 'livingAreaTo', value)}
                                                placeholder="500"
                                                style={{ width: 80 }}
                                            />
                                        </div>
                                    </Space>
                                </div>
                                <Slider
                                    range
                                    min={1}
                                    max={500}
                                    value={sliderValues.livingArea}
                                    onChange={(values) => handleSliderChange('livingArea', values)}
                                    tooltip={{
                                        formatter: (value) => `${value} м²`,
                                        placement: 'top'
                                    }}
                                    className={styles.rangeSlider}
                                />
                            </div>
                        )
                    },
                    {
                        key: '3',
                        label: 'Этаж',
                        children: (
                            <div className={styles.filterSection}>
                                <div className={styles.rangeInputs}>
                                    <Space>
                                        <div className={styles.inputGroup}>
                                            <InputNumber
                                                min={1}
                                                max={50}
                                                value={filters.floorFrom || 1}
                                                onChange={(value) => handleInputChange('floor', 'floorFrom', value)}
                                                placeholder="1"
                                                style={{ width: 80 }}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <InputNumber
                                                min={1}
                                                max={50}
                                                value={filters.floorTo || 50}
                                                onChange={(value) => handleInputChange('floor', 'floorTo', value)}
                                                placeholder="50"
                                                style={{ width: 80 }}
                                            />
                                        </div>
                                    </Space>
                                </div>
                                <Slider
                                    range
                                    min={1}
                                    max={50}
                                    value={sliderValues.floor}
                                    onChange={(values) => handleSliderChange('floor', values)}
                                    tooltip={{
                                        formatter: (value) => `${value} этаж`,
                                        placement: 'top'
                                    }}
                                    className={styles.rangeSlider}
                                />
                            </div>
                        )
                    },
                    {
                        key: '4',
                        label: 'Этажность дома',
                        children: (
                            <div className={styles.filterSection}>
                                <div className={styles.rangeInputs}>
                                    <Space>
                                        <div className={styles.inputGroup}>
                                            <InputNumber
                                                min={1}
                                                max={100}
                                                value={filters.totalFloorsFrom || 1}
                                                onChange={(value) => handleInputChange('totalFloors', 'totalFloorsFrom', value)}
                                                placeholder="1"
                                                style={{ width: 80 }}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <InputNumber
                                                min={1}
                                                max={100}
                                                value={filters.totalFloorsTo || 100}
                                                onChange={(value) => handleInputChange('totalFloors', 'totalFloorsTo', value)}
                                                placeholder="100"
                                                style={{ width: 80 }}
                                            />
                                        </div>
                                    </Space>
                                </div>
                                <Slider
                                    range
                                    min={1}
                                    max={100}
                                    value={sliderValues.totalFloors}
                                    onChange={(values) => handleSliderChange('totalFloors', values)}
                                    tooltip={{
                                        formatter: (value) => `${value} этажей`,
                                        placement: 'top'
                                    }}
                                    className={styles.rangeSlider}
                                />
                            </div>
                        )
                    }
                ]}
            />

            <Divider />

            <div className={styles.filterActions}>
                <Button 
                    type="primary" 
                    onClick={applyFilters}
                    className={styles.applyButton}
                    disabled={!hasActiveFilters}
                >
                    Применить фильтры
                </Button>
                
                {hasActiveFilters && (
                    <Button 
                        onClick={clearFilters}
                        icon={<ClearOutlined />}
                        className={styles.clearButton}
                    >
                                            Очистить
                </Button>
                )}
            </div>
        </div>
        </div>
    );
};

export default ListingsFilter;
