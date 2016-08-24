
"use strict";

let MssqlBase = module.exports = {
	
	TYPE_CUSTOMER: 1, // Заказчик
	TYPE_LOT: 3, // Участок
	TYPE_OBJ: 5, // Объект
	TYPE_INST: 7, // Электроустановка
	TYPE_REPORT: 9, // Техотчет
	TYPE_FOLDER: 10, // Папка
	
	treeReportItem: {
		baseFields: `
			[ИД] as id, 
			[ИДЭлемента] as pid, 
			[Имя] as name, 
			[Описание] as description, 
			[ИДКартинки] as type, 
			[Уровень] as level, 
			[Порядок] as position
		`
	}
};

MssqlBase.sqlTemplates = {
	reports: `
		SELECT ${MssqlBase.treeReportItem.baseFields}
		FROM [Alternativa].[dbo].[ДеревоОтчетов]
		WHERE [ИДКартинки] = ${MssqlBase.TYPE_REPORT}
	`,
	customers: `
		SELECT ${MssqlBase.treeReportItem.baseFields}
		FROM [Alternativa].[dbo].[ДеревоОтчетов]
		WHERE [ИДКартинки] = ${MssqlBase.TYPE_CUSTOMER}
	`,
	childs: `
		SELECT ${MssqlBase.treeReportItem.baseFields}
		FROM [Alternativa].[dbo].[ДеревоОтчетов]
		WHERE [ИДЭлемента] = @pid
	`,
	parent: `
		SELECT ${MssqlBase.treeReportItem.baseFields}
		FROM [Alternativa].[dbo].[ДеревоОтчетов]
		WHERE [ИД] = @pid
	`,
	
	// Внимание, по идее reportType (protocols) всегда должен равняться 9.
	// Если это не так, то кто-то из электриков запихнул отчет не в объект (а в папку например или еще куда).
	
	protocols: `
		SELECT 
			[П].[ID] as id,
			[П].[Порядок] as priority,
			[ЦИ].[Имя] as testPurpose,
			[П].[Имя] as name,
			[П].[Номер] as number,
			[П].[ДатаИспытания] as created,
			[П].[ДатаПроверки] as tested,
			[П].[НомерНеУстанавливать] as isWithoutNumber,
			[П].[Примечание] as note,
			[П].[Заключение] as conclusion,
			[П].[ИДДереваОтчетов] as report,
			[ДО].[ИДКартинки] as reportType
		FROM [Alternativa].[dbo].[Протоколы] as [П]
		LEFT JOIN [Alternativa].[dbo].[ЦелиИспытания] as [ЦИ] ON [ЦИ].[ID] = [П].[ИДЦелиИспытания]
		LEFT JOIN [Alternativa].[dbo].[ДеревоОтчетов] as [ДО] ON [ДО].[ИД] = [П].[ИДДереваОтчетов]
		WHERE [П].[Удален] = 0  
	`
};