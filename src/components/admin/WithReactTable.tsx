import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { Column, useTable, useSortBy, TableOptions, usePagination } from "react-table";

function WithReactTable<T extends object>(
	columns: Column<T>[],
	data: T[],
	containerClassName: string,
	heading: string,
	showPagination: boolean = false,
	pageSize: number = 5
) {
	return function ReactTable() {
		const option: TableOptions<T> = { columns, data, initialState: { pageSize } };
		const {
			getTableProps,
			getTableBodyProps,
			headerGroups,
			page,
			rows,
			prepareRow,
			pageCount,
			state: { pageIndex },
			nextPage,
			canNextPage,
			previousPage,
			canPreviousPage,
		} = useTable(option, useSortBy, usePagination);
		return (
			<div className={containerClassName}>
				<h2 className="heading">{heading}</h2>
				<table {...getTableProps()} className="reactTable">
					{/* TABLE HEAD  */}
					{/* =========== */}
					<thead>
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{/* TH OF TABLE  */}
								{/* ============ */}
								{headerGroup.headers.map((column) => (
									<th {...column.getHeaderProps(column.getSortByToggleProps())}>
										{column.render("Header")}
										{/* SORTING ICON  */}
										{/* ============= */}
										{column.isSorted ? (
											<span>
												{" "}
												{column.isSortedDesc ? (
													<AiOutlineSortDescending />
												) : (
													<AiOutlineSortAscending />
												)}
											</span>
										) : null}
									</th>
								))}
							</tr>
						))}
					</thead>
					{/* TABLE BODY  */}
					{/* =========== */}
					<tbody {...getTableBodyProps()}>
						{/* ROW OR PAGE  */}
						{/* ============= */}
						{(showPagination ? page : rows).map((row) => {
							prepareRow(row);
							return (
								<tr {...row.getRowProps()}>
									{row.cells.map((cell) => (
										<td {...cell.getCellProps()}>{cell.render("Cell")}</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
				{/* PAGINATION BUTTON  */}
				{/* ================== */}
				{showPagination ? (
					<div className="tablePagination">
						<button onClick={previousPage} disabled={!canPreviousPage}>
							Prev
						</button>
						<span>{`${pageIndex + 1} of ${pageCount}`}</span>
						<button onClick={nextPage} disabled={!canNextPage}>
							Next
						</button>
					</div>
				) : null}
			</div>
		);
	};
}

export default WithReactTable;
