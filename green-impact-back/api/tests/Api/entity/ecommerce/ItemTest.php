<?php
namespace App\Tests\Api\entity\ecommerce;

use App\Entity\ECommerce\Category;
use App\Entity\ECommerce\Collection;
use App\Entity\Ecommerce\Item;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use App\Tests\ApiAuthenticationTest;

/**
 * Class ItemTest
 * @package Item
 */
class ItemTest extends ApiAuthenticationTest
{
    use RefreshDatabaseTrait;

    /**
     * Test Get Collection of Item
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testGetItem(): void
    {
        $response = $this->createClientWithCredentials()->request('GET', '/items');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/Item',
            '@id' => '/items',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 200,
        ]);

        $this->assertCount(30, $response->toArray()['hydra:member']);

    }

    /**
     * Test create Item
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testCreateItem(): void
    {
        $collectionIri = $this->findIriBy(Collection::class, ['name' => 'collection_1']);
        $categoryIri = $this->findIriBy(Category::class, ['name' => 'category_1']);

        $this->createClientWithCredentials()->request('POST', '/items', [
            'json' => [
                "name" => "test",
                "description" => "test",
                "price" => 0,
                "size" => ["s", "m", "l"],
                "category" => $categoryIri,
                "collection" => $collectionIri
            ]
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Item',
            '@type' => 'Item',
            "name" => "test",
            "description" => "test",
            "price" => 0,
            "size" => ["s", "m", "l"],
            "category" => $categoryIri,
            "collection" => $collectionIri
        ]);
    }

    /**
     * Test creating an invalid item
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testCreateInvalidItem(): void
    {
        $this->createClientWithCredentials()->request('POST', '/items', [
            'json' => []
        ]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value should not be blank.
category: This value should not be null.
collection: This value should not be null.',
        ]);
    }

    /**
     * Test if update a item
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testUpdateItem(): void
    {
        $iri = $this->findIriBy(Item::class, ['name' => 'item_1']);

        $this->createClientWithCredentials()->request('PATCH', $iri, [
            'json' => [ 'name' => 'test'],
            "headers" => [
                "Content-Type" => "application/merge-patch+json"
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'name' => 'test',
        ]);
    }

    /**
     * Test if delete business.
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testDeleteItem(): void
    {
        $iri = $this->findIriBy(Item::class, ['name' => 'item_1']);

        $this->createClientWithCredentials()->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            $this->getContainer()->get('doctrine')->getRepository(Item::class)->findOneBy(['name' => 'item_1'])
        );
    }
}
