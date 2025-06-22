// Test script for GitHub API integration
import { githubService } from './src/lib/github';

async function testGitHubIntegration() {
  console.log('Testing GitHub API integration...');
  
  try {
    // Test 1: Get repository structure
    console.log('\n1. Testing repository structure...');
    const structure = await githubService.getRepositoryStructure('articles');
    console.log(`Found ${structure.length} items in articles directory:`);
    structure.forEach(item => {
      console.log(`  - ${item.name} (${item.type})`);
    });

    // Test 2: Get all categories
    console.log('\n2. Testing categories...');
    const categories = await githubService.getAllCategories();
    console.log(`Found ${categories.length} categories:`);
    categories.forEach(category => {
      console.log(`  - ${category.title} (${category.articles.length} articles)`);
      if (category.mainPage) {
        console.log(`    Main page: ${category.mainPage.title}`);
      }
      category.articles.forEach(article => {
        console.log(`    Article: ${article.title}`);
      });
    });

    // Test 3: Get main README
    console.log('\n3. Testing main README...');
    const readme = await githubService.getMainReadme();
    if (readme) {
      console.log(`README title: ${readme.title}`);
      console.log(`README content length: ${readme.content.length} characters`);
    } else {
      console.log('No README found');
    }

    console.log('\n✅ GitHub API integration test completed successfully!');
  } catch (error) {
    console.error('❌ GitHub API integration test failed:', error);
  }
}

// Run the test
testGitHubIntegration();

