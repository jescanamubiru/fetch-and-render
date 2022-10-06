const { Button } = ReactBootstrap;

const Pagination = ({ items, pageSize, onPageChange }) => {
    // Part 2 code goes here
    if (items.length <= 1) return null;
    const numberOfPages = items.length / pageSize;
    const pages = range(1, numberOfPages);
    // console.log('pageSize>>> ',pageSize);
    // console.log('pages>>> ',pages);
    const list = [];
    pages.forEach(page => {
        list.push(<Button className="page-item m-1" key={page} onClick={onPageChange}>{page}</Button>);
    });
    return list;
};

const range = (start, end) => {
    // console.log('adas>>>', end - start + 1);
    return Array(Math.ceil(end - start + 1))
        .fill(0)
        .map((item, i) => start + i);
};

function paginate(items, pageNumber, pageSize) {
    const start = (pageNumber - 1) * pageSize;
    let page = items.slice(start, start + pageSize);
    return page;
}

const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);

    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        data: initialData,
    });

    useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            // Part 1, step 1 code goes here
            dispatch({ type: 'FETCH_INIT' });
            axios.get(url)
                .then(result => {
                    console.log(result.data);
                    dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
                }, error => {
                    console.log(error);
                    dispatch({ type: 'FETCH_FAILURE' });
                });
        };
        fetchData();
        return () => {
            didCancel = true;
        };
    }, [url]);
    return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case 'FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        default:
            throw new Error();
    }
};

// App that gets data from Hacker News url
function App() {
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState('MIT');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
        // 'https://hn.algolia.com/api/v1/search?query=MIT',
        'https://api.gemini.com/v1/pricefeed',
        []
    );
    const handlePageChange = (e) => {
        setCurrentPage(Number(e.target.textContent));
    };
    // console.log('data>>>>>', data);
    let page = data;
    if (page.length >= 1) {
        page = paginate(page, currentPage, pageSize);
        console.log(`currentPage: ${currentPage}`);
    }
    // console.log('page>>>>>> ', page);
    return (
        <Fragment>
            {isLoading ? (
                <div>Loading ...</div>
            ) : (
                <div className="container m-4">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Pair</th>
                                <th scope="col">Price</th>
                                <th scope="col">Percentage Change (24h)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {page.map((item) => (
                                <tr key={item.pair}>
                                    <th scope="row">{item.pair}</th>
                                    <td>{item.price}</td>
                                    <td>{item.percentChange24h}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="container m-4">
                <Pagination
                    items={data}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                ></Pagination>
            </div>
        </Fragment>
    );
}

// ========================================
ReactDOM.render(<App />, document.getElementById('root'));
