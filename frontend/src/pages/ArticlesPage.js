import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../store/articlesSlice';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Alert,
  Pagination,
  Box,
  Autocomplete,
  Skeleton,
  Collapse,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Launch as ReadIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

export default function ArticlesPage() {
  const dispatch = useDispatch();
  const { articles, loading, error } = useSelector((state) => state.articles);

  const [filters, setFilters] = useState({
    source: null,
    category: null,
    author: null,
    date: '',
  });
  const [keyword, setKeyword] = useState('');
  const [hasSearched, sethasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  useEffect(() => {
    dispatch(fetchArticles({ page: 1 }));
  }, [dispatch]);

  const handleSearch = () => {
    setCurrentPage(1);
    if (!keyword) return;
    dispatch(fetchArticles({ keyword, page: 1 }));
    sethasSearched(true)
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (event, value, name) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    setFilters((prev) => ({ ...prev, date: e.target.value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      source: null,
      category: null,
      author: null,
      date: '',
    });
    setKeyword('');
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handlePageChange = (event, page) => {
    if (page >= 1 && page <= articles.last_page) {
      setCurrentPage(page);
      dispatch(fetchArticles({ keyword, page }));
    }

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 100);
  };

  const sourceOptions = useMemo(() => {
    const sources = articles.data?.map((article) => article.source?.name).filter(Boolean);
    const uniqueSources = [...new Set(sources)];
    return uniqueSources.map((source) => ({ label: source, value: source }));
  }, [articles.data]);

  const categoryOptions = useMemo(() => {
    const categories = articles.data?.map((article) => article.category?.name).filter(Boolean);
    const uniqueCategories = [...new Set(categories)];
    return uniqueCategories.map((category) => ({ label: category, value: category }));
  }, [articles.data]);

  const authorOptions = useMemo(() => {
    const authors = articles.data?.map((article) => article.author?.name).filter(Boolean);
    const uniqueAuthors = [...new Set(authors)];
    return uniqueAuthors.map((author) => ({ label: author, value: author }));
  }, [articles.data]);

  const filteredArticles = useMemo(() => {
    if (!articles.data) return [];

    return articles.data.filter((article) => {
      const matchesSource = filters.source
        ? article.source?.name.toLowerCase().includes(filters.source.value.toLowerCase())
        : true;
      const matchesCategory = filters.category
        ? article.category?.name.toLowerCase().includes(filters.category.value.toLowerCase())
        : true;
      const matchesAuthor = filters.author
        ? article.author?.name.toLowerCase().includes(filters.author.value.toLowerCase())
        : true;
      const matchesDate = filters.date
        ? new Date(article.published_at).toLocaleDateString('en-CA') === filters.date
        : true;

      return matchesSource && matchesCategory && matchesAuthor && matchesDate;
    });
  }, [articles.data, filters]);

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{
        color: "#0A3981",
        textDecoration: 'underline',
        textDecorationColor: 'gray',
        fontWeight: '400',
        fontFamily: '"Sriracha", cursive',
      }}>
        Explore News Articles

      </Typography>



      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search articles by keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              aria-label="Search articles"
            />
          </Grid>

          <Grid item xs={12} md={3} display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }}>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleClearFilters}
              aria-label="Clear Filters"
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={handleToggleFilters}
          aria-label={showFilters ? 'Hide Filters' : 'Show Filters'}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                options={sourceOptions}
                value={filters.source}
                onChange={(event, newValue) => handleFilterChange(event, newValue, 'source')}
                renderInput={(params) => <TextField {...params} label="Source" variant="outlined" />}
                isClearable
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                options={categoryOptions}
                value={filters.category}
                onChange={(event, newValue) => handleFilterChange(event, newValue, 'category')}
                renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />}
                isClearable
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                options={authorOptions}
                value={filters.author}
                onChange={(event, newValue) => handleFilterChange(event, newValue, 'author')}
                renderInput={(params) => <TextField {...params} label="Author" variant="outlined" />}
                isClearable
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={filters.date}
                onChange={handleDateChange}
                variant="outlined"
                aria-label="Filter by Date"
              />
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      <Typography
        variant="body1"
        align="left"
        gutterBottom
        sx={{
          color: "#0A3981",
          textDecoration: "none",
          fontWeight: 400,
          fontFamily: '"Sriracha", cursive',
        }}
      >
        {hasSearched ? "Search Results:-" : "News Feed:-"}
      </Typography>

      {loading && (
        <Grid container spacing={2}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton />
              <Skeleton width="60%" />
            </Grid>
          ))}
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Grid container spacing={4}>
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {article.image_url ? (
                    <CardMedia
                      component="img"
                      height="180"
                      image={article.image_url}
                      alt={article.title}
                      loading="lazy"
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 180,
                        backgroundColor: 'grey.300',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="subtitle1" color="textSecondary">
                        No Image
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {article.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                      Source: {article.source?.name || 'N/A'} | Category: {article.category?.name || 'N/A'} | Author:{' '}
                      {article.author?.name || 'N/A'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                      Published: {new Date(article.published_at).toLocaleDateString()}
                    </Typography>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<ReadIcon />}
                      aria-label={`Read more about ${article.title}`}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                No articles found on this page with applied filters.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {articles.last_page && articles.last_page > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: { xs: 2, sm: 4 }, 
            mb: { xs: 2, sm: 4 },
            padding: '25px 5px',
            flexDirection: { xs: "column", sm: "row" }, 
            alignItems: "center",
            gap: 2,
          }}
        >
          <Pagination
            count={articles.last_page}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            siblingCount={1} 
            boundaryCount={1}
            size="small"
            aria-label="Article Pagination"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: { xs: "0.8rem", sm: "1rem" },
                padding: { xs: "4px", sm: "6px" },
              },
            }}
          />
        </Box>
      )}

    </Container>
  );
};
